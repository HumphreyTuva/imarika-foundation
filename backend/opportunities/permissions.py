"""
opportunities/permissions.py
-----------------------------
Custom DRF permission classes for the Opportunities module.

Permission matrix
-----------------
| Action              | Public (unauthenticated) | Staff / Admin |
|---------------------|--------------------------|---------------|
| List opportunities  | ✓ (published only)       | ✓ (all)       |
| Retrieve detail     | ✓ (published only)       | ✓ (all)       |
| Create              | ✗                        | ✓             |
| Update / Partial    | ✗                        | ✓             |
| Delete              | ✗                        | ✓             |
| Manage attachments  | ✗                        | ✓             |

"Published" means status != 'draft' and status != 'archived'.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Safe methods (GET, HEAD, OPTIONS) are open to everyone.
    Write methods (POST, PUT, PATCH, DELETE) require staff status.

    This is the primary permission class for OpportunityViewSet.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        # For write operations, require authentication + staff flag
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsStaffUser(BasePermission):
    """
    Grants access only to authenticated staff / admin users.
    Used for the attachment management endpoints.
    """

    message = "Only staff members can manage opportunity attachments."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
