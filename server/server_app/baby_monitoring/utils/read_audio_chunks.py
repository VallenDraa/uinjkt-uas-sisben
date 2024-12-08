import aiofiles


async def read_audio_chunks(audio_path: str):
    async with aiofiles.open(audio_path, "rb") as audio_file:
        while chunk := await audio_file.read(1024):  # Stream in 1 KB chunks
            yield chunk
