from io import BytesIO
import os
import asyncio
import aiofiles
from PIL import Image, UnidentifiedImageError


async def read_frame(file_path):
    async with aiofiles.open(file_path, "rb") as file:
        return await file.read()


async def send_frame(frame_data):
    return b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame_data + b"\r\n"


async def get_fallback_frame(last_valid_frame, hardware_id, placeholder_path):
    if last_valid_frame.get(hardware_id):
        with Image.open(BytesIO(last_valid_frame.get(hardware_id))) as img:
            img.verify()
            return await send_frame(last_valid_frame[hardware_id])

    else:
        return await send_frame(await read_frame(placeholder_path))


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
                frame_data = await read_frame(video_frame_path)

                try:
                    with Image.open(BytesIO(frame_data)) as img:
                        img.verify()
                        last_valid_frame[hardware_id] = frame_data
                        yield await send_frame(frame_data)

                except (UnidentifiedImageError, OSError) as e:
                    print(f"Invalid frame, using last valid frame as fallback: {e}")
                    yield await get_fallback_frame(
                        last_valid_frame, hardware_id, placeholder_path
                    )

            else:
                yield await get_fallback_frame(
                    last_valid_frame, hardware_id, placeholder_path
                )

        except (IOError, OSError) as e:
            print(f"Failed to read frame, using last valid frame as fallback: {e}")
            yield await get_fallback_frame(
                last_valid_frame, hardware_id, placeholder_path
            )

        await asyncio.sleep(1 / frame_rate)
