from api.models import Language
from api.serializers import LanguageSerializer
from .base import PeybarListCreateAPIView, PeybarListAPIView, PeybarRetrieveUpdateDestroyAPIView


class LanguageList(PeybarListAPIView):
    serializer_class = LanguageSerializer

    def get_queryset(self):
        return Language.objects.all()
