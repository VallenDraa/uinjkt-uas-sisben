from pathlib import Path
from django.http import StreamingHttpResponse
from django.views import View

from .utils.generate_video_frames import generate_video_frames


class VideoStreamView(View):
    async def get(self, request, hardware_id=None, *args, **kwargs):
        IMAGES_DIR = Path("./baby_monitoring/images")
        video_frame_path = IMAGES_DIR / f"{hardware_id}_video_frame.jpeg"
        placeholder_path = IMAGES_DIR / "frame_placeholder.jpeg"

        response = StreamingHttpResponse(
            generate_video_frames(
                video_frame_path,
                placeholder_path,
                hardware_id=hardware_id,
            ),
            content_type="multipart/x-mixed-replace; boundary=frame",
        )

        response["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response["Pragma"] = "no-cache"
        response["Expires"] = "0"

        return response
