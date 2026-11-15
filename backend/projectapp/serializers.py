from .models import VillageModel
from rest_framework import serializers

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VillageModel
        fields = '__all__'
