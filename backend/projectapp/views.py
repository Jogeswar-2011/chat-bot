from django.shortcuts import render
from .models import VillageModel
from .serializers import VillageSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(['GET','POST'])
def village_list(request):
    if request.method=='GET':
        villages=VillageModel.objects.all()
        serializer=VillageSerializer(villages,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    elif request.method=='POST':
        serializer=VillageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"error": "Invalid data provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
def village_detail(request,pk):
    try:
        village=VillageModel.objects.get(pk=pk)
    except VillageModel.DoesNotExist:
        return Response({"message": "Village not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method=='GET':
        serializer=VillageSerializer(village)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=VillageSerializer(village,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Village updated successfully"}, status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        village.delete()
        return Response({"message": "Village deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

