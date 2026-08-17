from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Category, Product

class Command(BaseCommand):
    help = 'Seeds database with default categories, products, and admin user'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting database seed...'))

        # Create Demo Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created superuser: admin / admin123'))
        
        # Create Demo Regular User
        if not User.objects.filter(username='demo').exists():
            User.objects.create_user('demo', 'demo@example.com', 'demo123', first_name='Alex', last_name='Morgan')
            self.stdout.write(self.style.SUCCESS('Created demo user: demo / demo123'))

        # Categories
        cat_audio, _ = Category.objects.get_or_create(
            slug='audio-sound',
            defaults={'name': 'Audio & Sound', 'description': 'High fidelity headphones, speakers and earbuds', 'icon': 'headphones'}
        )
        cat_wearables, _ = Category.objects.get_or_create(
            slug='wearables',
            defaults={'name': 'Wearables', 'description': 'Smartwatches, fitness trackers and smart rings', 'icon': 'smartwatch'}
        )
        cat_gaming, _ = Category.objects.get_or_create(
            slug='gaming-pc',
            defaults={'name': 'Gaming & PC', 'description': 'Mechanical keyboards, gaming mice and accessories', 'icon': 'keyboard'}
        )
        cat_accessories, _ = Category.objects.get_or_create(
            slug='accessories',
            defaults={'name': 'Accessories & Gear', 'description': 'Cameras, desk lighting and smart tech accessories', 'icon': 'camera'}
        )

        products_data = [
            {
                'category': cat_audio,
                'title': 'Apex ANC Wireless Headphones',
                'slug': 'apex-anc-wireless-headphones',
                'description': 'Experience studio-quality audio with advanced hybrid active noise cancellation, custom 40mm beryllium drivers, and up to 40 hours of battery life on a single charge.',
                'price': 299.99,
                'old_price': 349.99,
                'stock': 25,
                'rating': 4.9,
                'reviews_count': 42,
                'image_url': '/static/images/headphones.png',
                'badge': 'HOT'
            },
            {
                'category': cat_wearables,
                'title': 'Titan Series Pro Smartwatch',
                'slug': 'titan-series-pro-smartwatch',
                'description': 'Aerospace titanium casing featuring ultra-bright AMOLED display, continuous ECG monitoring, multi-band GPS, and 7-day battery endurance.',
                'price': 199.99,
                'old_price': 249.99,
                'stock': 40,
                'rating': 4.8,
                'reviews_count': 38,
                'image_url': '/static/images/smartwatch.png',
                'badge': 'BESTSELLER'
            },
            {
                'category': cat_gaming,
                'title': 'Nebula Mechanical RGB Keyboard',
                'slug': 'nebula-mechanical-rgb-keyboard',
                'description': 'Hot-swappable linear mechanical switches, gasket-mounted acoustic design, per-key RGB backlighting, and durable PBT double-shot keycaps.',
                'price': 149.99,
                'old_price': 179.99,
                'stock': 30,
                'rating': 4.7,
                'reviews_count': 29,
                'image_url': '/static/images/keyboard.png',
                'badge': 'NEW'
            },
            {
                'category': cat_gaming,
                'title': 'Precision Wireless Gaming Mouse',
                'slug': 'precision-wireless-gaming-mouse',
                'description': 'Ultra-lightweight 58g ergonomic design, 26,000 DPI optical sensor, zero-latency 2.4GHz wireless connection, and PTFE mouse feet.',
                'price': 79.99,
                'old_price': 99.99,
                'stock': 60,
                'rating': 4.6,
                'reviews_count': 51,
                'image_url': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
                'badge': 'POPULAR'
            },
            {
                'category': cat_accessories,
                'title': 'Horizon Ultra 4K Mirrorless Camera',
                'slug': 'horizon-ultra-4k-camera',
                'description': 'Full-frame 24.2MP sensor capable of 4K 60fps video recording, 5-axis sensor-shift image stabilization, and real-time AI eye tracking AF.',
                'price': 899.99,
                'old_price': 999.99,
                'stock': 12,
                'rating': 4.9,
                'reviews_count': 18,
                'image_url': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
                'badge': 'FEATURED'
            },
            {
                'category': cat_audio,
                'title': 'Pulse Hi-Fi Portable Speaker',
                'slug': 'pulse-hifi-portable-speaker',
                'description': '360-degree room-filling acoustic sound, IP67 dust & water resistance, ambient LED pulse lighting rings, and 20-hour playback time.',
                'price': 119.99,
                'old_price': 139.99,
                'stock': 50,
                'rating': 4.7,
                'reviews_count': 33,
                'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
                'badge': 'SALE'
            },
            {
                'category': cat_accessories,
                'title': 'Aura Desk Ambient Smart Light Bar',
                'slug': 'aura-desk-ambient-smart-light-bar',
                'description': 'Asymmetric optical glare-free screen lighting, touch dimming control, RGB backlight sync, and solid aluminum alloy build.',
                'price': 64.99,
                'old_price': 79.99,
                'stock': 80,
                'rating': 4.5,
                'reviews_count': 22,
                'image_url': 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
                'badge': 'TRENDING'
            },
            {
                'category': cat_audio,
                'title': 'SoundBuds Pro True Wireless Earbuds',
                'slug': 'soundbuds-pro-tws-earbuds',
                'description': 'Active noise cancellation with transparency mode, wireless charging case, IPX5 water resistance, and crystal-clear triple mic call quality.',
                'price': 129.99,
                'old_price': 149.99,
                'stock': 45,
                'rating': 4.8,
                'reviews_count': 64,
                'image_url': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
                'badge': 'HOT'
            }
        ]

        for p_data in products_data:
            product, created = Product.objects.update_or_create(
                slug=p_data['slug'],
                defaults=p_data
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(f'{action} product: {product.title}'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
