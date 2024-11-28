import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import baby_monitoring.routing


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server_app.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(baby_monitoring.routing.websocket_urlpatterns)
        ),
    }
)
