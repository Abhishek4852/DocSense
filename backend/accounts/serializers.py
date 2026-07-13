from rest_framework import serializers
from .models import User, Organization

class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'organization_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        org_name = validated_data.pop('organization_name')
        org, _ = Organization.objects.get_or_create(name=org_name)
        
        username = validated_data.get('email').split('@')[0]
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            organization=org
        )
        return user
