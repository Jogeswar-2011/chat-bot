from django.db import models

# Create your models here.
class VillageModel(models.Model):
    name = models.CharField(max_length=100)
    population = models.IntegerField()
    area = models.CharField(max_length=100)

    def __str__(self):
        return self.name
