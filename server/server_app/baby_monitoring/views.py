from pathlib import Path
from django.http import StreamingHttpResponse
from django.views import View

from .utils.read_audio_chunks import read_audio_chunks
from .utils.generate_video_frames import generate_video_frames


class VideoStreamView(View):
    IMAGES_DIR = Path("./baby_monitoring/images")
    placeholder_path = IMAGES_DIR / "frame_placeholder.jpeg"

    async def get(self, request, hardware_id=None, *args, **kwargs):
        response = StreamingHttpResponse(
            generate_video_frames(
                video_frame_path=self.IMAGES_DIR / f"{hardware_id}_video_frame.jpeg",
                placeholder_path=self.placeholder_path,
                hardware_id=hardware_id,
            ),
            content_type="multipart/x-mixed-replace; boundary=frame",
        )

        return response


class AudioStreamView(View):
    audio_dir = Path("./baby_monitoring/audio")

    def get(self, request, hardware_id):
        audio_path = self.audio_dir / f"{hardware_id}_audio_chunk.wav"

        return StreamingHttpResponse(
            read_audio_chunks(audio_path),
            content_type="audio/wav",
        )
