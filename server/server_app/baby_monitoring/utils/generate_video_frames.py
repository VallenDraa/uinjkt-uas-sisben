from io import BytesIO
import os
import asyncio
import aiofiles
from PIL import Image, UnidentifiedImageError


async def generate_video_frames(
    video_frame_path: str,
    placeholder_path: str,
    frame_rate: float = 15.0,
    hardware_id: str = None,
):
    last_valid_frame = {}

    while True:
        try:
            if os.path.exists(video_frame_path):
                # Read the frame
                async with aiofiles.open(video_frame_path, "rb") as frame:
                    frame_data = await frame.read()

                # Validate the image using Pillow
                try:
                    with Image.open(BytesIO(frame_data)) as img:
                        img.verify()  # Validate the file

                        # Update the last valid frame
                        last_valid_frame[hardware_id] = frame_data

                        # Send the valid frame
                        yield (
                            b"--frame\r\n"
                            b"Content-Type: image/jpeg\r\n\r\n" + frame_data + b"\r\n"
                        )
                except (UnidentifiedImageError, OSError) as e:
                    if last_valid_frame[hardware_id]:
                        yield (
                            b"--frame\r\n"
                            b"Content-Type: image/jpeg\r\n\r\n"
                            + last_valid_frame[hardware_id]
                            + b"\r\n"
                        )
                    else:
                        async with aiofiles.open(placeholder_path, "rb") as placeholder:
                            yield (
                                b"--frame\r\n"
                                b"Content-Type: image/jpeg\r\n\r\n"
                                + await placeholder.read()
                                + b"\r\n"
                            )
            else:
                if last_valid_frame[hardware_id]:
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n"
                        + last_valid_frame[hardware_id]
                        + b"\r\n"
                    )
                else:
                    async with aiofiles.open(placeholder_path, "rb") as placeholder:
                        yield (
                            b"--frame\r\n"
                            b"Content-Type: image/jpeg\r\n\r\n"
                            + await placeholder.read()
                            + b"\r\n"
                        )
        except (IOError, OSError) as e:
            if last_valid_frame[hardware_id]:
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n"
                    + last_valid_frame[hardware_id]
                    + b"\r\n"
                )
            else:
                async with aiofiles.open(placeholder_path, "rb") as placeholder:
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n"
                        + await placeholder.read()
                        + b"\r\n"
                    )

        await asyncio.sleep(1 / frame_rate)
