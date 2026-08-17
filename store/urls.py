from django.urls import path
from . import views

urlpatterns = [
    # HTML Pages
    path('', views.index_view, name='index'),
    path('shop/', views.shop_view, name='shop'),
    path('product/<slug:slug>/', views.product_detail_view, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('orders/', views.orders_view, name='orders'),
    path('orders/<str:order_number>/', views.order_status_view, name='order_status'),
    path('account/login/', views.login_view, name='login'),
    path('account/register/', views.register_view, name='register'),

    # Admin Dashboard
    path('admin-dashboard/login/', views.admin_login_view, name='admin_login'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('admin-dashboard/products/', views.admin_products_view, name='admin_products'),
    path('admin-dashboard/products/add/', views.admin_product_add_view, name='admin_product_add'),

    # API endpoints
    path('api/products/', views.api_products, name='api_products'),
    path('api/products/<int:pk>/', views.api_product_detail, name='api_product_detail'),
    path('api/admin/products/add/', views.api_admin_product_add, name='api_admin_product_add'),
    path('api/admin/products/<int:pk>/delete/', views.api_admin_product_delete, name='api_admin_product_delete'),
    path('api/order/place/', views.api_place_order, name='api_place_order'),
    path('api/auth/register/', views.api_register, name='api_register'),
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/admin-login/', views.api_admin_login, name='api_admin_login'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    path('api/auth/user/', views.api_user_status, name='api_user_status'),
]
