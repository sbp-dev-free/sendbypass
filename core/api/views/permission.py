#!/usr/bin/env python3
#

from api.models.temp_object import TempObject

from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view,obj):
        if isinstance(obj, TempObject):
            return obj.data['user_id'] == request.user.id

        return obj.user == request.user

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return request.user.is_authenticated
