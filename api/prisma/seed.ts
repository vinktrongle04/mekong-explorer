import { PrismaClient, MediaPlatform, MediaStatus, PlaceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Categories
  const categories = [
    { name: 'Di tích & Văn hóa', slug: 'culture', iconName: 'landmark' },
    { name: 'Thiên nhiên & Sinh thái', slug: 'nature', iconName: 'leaf' },
    { name: 'Ẩm thực & Đặc sản', slug: 'food', iconName: 'utensils' },
    { name: 'Cà phê & Chill', slug: 'coffee', iconName: 'coffee' },
    { name: 'Vui chơi & Giải trí', slug: 'entertainment', iconName: 'party-popper' },
    { name: 'Lưu trú & Resort', slug: 'resort', iconName: 'hotel' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  const allCats = await prisma.category.findMany();
  const catMap = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

  // 2. Sample User for submissions
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mekongexplorer.com' },
    update: {},
    create: {
      email: 'admin@mekongexplorer.com',
      passwordHash: '$2b$10$SomethingSecret', // Placeholder
      role: 'ADMIN',
    },
  });

  // 3. Define 50 Famous Mekong Delta Locations
  const placesData = [
    // Can Tho
    { name: 'Chợ nổi Cái Răng', province: 'Cần Thơ', lat: 10.005, lng: 105.745, cat: 'culture', desc: 'Chợ nổi lớn nhất và sầm uất nhất miền Tây.' },
    { name: 'Bến Ninh Kiều', province: 'Cần Thơ', lat: 10.034, lng: 105.789, cat: 'nature', desc: 'Biểu tượng của thành phố Cần Thơ bên dòng sông Hậu.' },
    { name: 'Thiền viện Trúc Lâm Phương Nam', province: 'Cần Thơ', lat: 9.982, lng: 105.698, cat: 'culture', desc: 'Ngôi thiền viện lớn nhất miền Tây Nam Bộ.' },
    { name: 'Nhà cổ Bình Thủy', province: 'Cần Thơ', lat: 10.062, lng: 105.752, cat: 'culture', desc: 'Ngôi nhà cổ hơn 100 năm tuổi với kiến trúc Pháp-Hoa.' },
    { name: 'Vườn cò Bằng Lăng', province: 'Cần Thơ', lat: 10.215, lng: 105.523, cat: 'nature', desc: 'Nơi cư trú của hàng ngàn con cò trắng.' },

    // An Giang
    { name: 'Rừng tràm Trà Sư', province: 'An Giang', lat: 10.552, lng: 105.048, cat: 'nature', desc: 'Hệ sinh thái rừng ngập mặn tiêu biểu của vùng Tứ giác Long Xuyên.' },
    { name: 'Miếu Bà Chúa Xứ Núi Sam', province: 'An Giang', lat: 10.697, lng: 105.078, cat: 'culture', desc: 'Điểm tâm linh linh thiêng nhất vùng Bảy Núi.' },
    { name: 'Thánh đường Al-Ehsan', province: 'An Giang', lat: 10.742, lng: 105.121, cat: 'culture', desc: 'Kiến trúc Hồi giáo độc đáo của cộng đồng người Chăm.' },
    { name: 'Hồ Tà Pạ', province: 'An Giang', lat: 10.468, lng: 104.992, cat: 'nature', desc: 'Được mệnh danh là Tuyệt Tình Cốc phiên bản miền Tây.' },
    { name: 'Chợ Châu Đốc', province: 'An Giang', lat: 10.712, lng: 105.125, cat: 'food', desc: 'Vương quốc của các loại mắm đặc sản.' },

    // Kien Giang
    { name: 'Phú Quốc Night Market', province: 'Kiên Giang', lat: 10.218, lng: 103.959, cat: 'food', desc: 'Chợ đêm sầm uất với hải sản tươi sống.' },
    { name: 'Hà Tiên - Thạch Động', province: 'Kiên Giang', lat: 10.421, lng: 104.492, cat: 'nature', desc: 'Danh lam thắng cảnh kỳ thú với hang động trong lòng núi đá vôi.' },
    { name: 'Đảo Hòn Sơn', province: 'Kiên Giang', lat: 9.805, lng: 104.641, cat: 'nature', desc: 'Hòn đảo hoang sơ với những bãi tắm trong xanh.' },
    { name: 'Quần đảo Nam Du', province: 'Kiên Giang', lat: 9.683, lng: 104.352, cat: 'nature', desc: 'Vịnh Hạ Long của phương Nam.' },

    // Ben Tre
    { name: 'Cồn Phụng', province: 'Bến Tre', lat: 10.252, lng: 106.321, cat: 'nature', desc: 'Khu du lịch sinh thái nổi tiếng bên dòng sông Tiền.' },
    { name: 'Làng du lịch Mỹ Khánh', province: 'Cần Thơ', lat: 10.012, lng: 105.712, cat: 'entertainment', desc: 'Điểm vui chơi đậm chất dân dã miền Tây.' },
    { name: 'Sân chim Vàm Hồ', province: 'Bến Tre', lat: 10.125, lng: 106.582, cat: 'nature', desc: 'Khu lưu trú của hơn 500.000 cá thể chim.' },

    // Dong Thap
    { name: 'Làng hoa Sa Đéc', province: 'Đồng Tháp', lat: 10.282, lng: 105.752, cat: 'nature', desc: 'Vườn hoa lớn nhất miền Tây cung cấp hoa cho cả nước.' },
    { name: 'Vườn quốc gia Tràm Chim', province: 'Đồng Tháp', lat: 10.582, lng: 105.512, cat: 'nature', desc: 'Nơi bảo tồn loài Sếu đầu đỏ quý hiếm.' },
    { name: 'Khu di tích Xẻo Quýt', province: 'Đồng Tháp', lat: 10.412, lng: 105.812, cat: 'culture', desc: 'Căn cứ cách mạng giữa rừng tràm nguyên sinh.' },

    // Soc Trang
    { name: 'Chùa Dơi (Chùa Mahatup)', province: 'Sóc Trăng', lat: 9.582, lng: 105.972, cat: 'culture', desc: 'Ngôi chùa nổi tiếng với hàng ngàn con dơi sinh sống.' },
    { name: 'Chùa Chén Kiểu', province: 'Sóc Trăng', lat: 9.552, lng: 105.821, cat: 'culture', desc: 'Kiến trúc Khmer được trang trí bằng các mảnh bát đĩa sứ.' },
    { name: 'Chùa Đất Sét', province: 'Sóc Trăng', lat: 9.612, lng: 105.982, cat: 'culture', desc: 'Nổi tiếng với hàng ngàn pho tượng làm bằng đất sét.' },

    // Bac Lieu
    { name: 'Cánh đồng quạt gió Bạc Liêu', province: 'Bạc Liêu', lat: 9.221, lng: 105.812, cat: 'nature', desc: 'Cánh đồng điện gió lớn nhất Việt Nam bên bờ biển.' },
    { name: 'Nhà Công tử Bạc Liêu', province: 'Bạc Liêu', lat: 9.282, lng: 105.712, cat: 'culture', desc: 'Dinh thự xa hoa gắn liền với huyền thoại Công tử Bạc Liêu.' },
    { name: 'Phật Bà Nam Hải', province: 'Bạc Liêu', lat: 9.215, lng: 105.789, cat: 'culture', desc: 'Điểm tâm linh nổi tiếng của khách hành hương.' },

    // Ca Mau
    { name: 'Mũi Cà Mau', province: 'Cà Mau', lat: 8.618, lng: 104.712, cat: 'nature', desc: 'Điểm cực Nam hẻo lánh của Tổ quốc.' },
    { name: 'Hòn Đá Bạc', province: 'Cà Mau', lat: 9.182, lng: 104.812, cat: 'nature', desc: 'Cụm đảo nổi tiếng với những tảng đá kỳ lạ.' },
    { name: 'Rừng quốc gia U Minh Hạ', province: 'Cà Mau', lat: 9.282, lng: 104.912, cat: 'nature', desc: 'Vùng đất ngập nước đặc trưng với cây tràm.' },

    // Tra Vinh
    { name: 'Chùa Hang', province: 'Trà Vinh', lat: 9.912, lng: 106.312, cat: 'culture', desc: 'Ngôi chùa có cổng vào thiết kế như một cái hang.' },
    { name: 'Ao Bà Om', province: 'Trà Vinh', lat: 9.921, lng: 106.321, cat: 'nature', desc: 'Ao nước tĩnh lặng rợp bóng hàng cây cổ thụ.' },
    { name: 'Biển Ba Động', province: 'Trà Vinh', lat: 9.712, lng: 106.612, cat: 'nature', desc: 'Bãi biển mang vẻ đẹp hoang sơ giữa vùng duyên hải.' },

    // Vinh Long
    { name: 'Văn Thánh Miếu Vĩnh Long', province: 'Vĩnh Long', lat: 10.252, lng: 105.952, cat: 'culture', desc: 'Di tích văn hóa có lịch sử hơn 150 năm.' },
    { name: 'Lò gạch và gốm Mang Thít', province: 'Vĩnh Long', lat: 10.221, lng: 106.082, cat: 'culture', desc: 'Vương quốc đỏ với hàng ngàn lò gạch cổ.' },

    // Tien Giang
    { name: 'Chùa Vĩnh Tràng', province: 'Tiền Giang', lat: 10.352, lng: 106.362, cat: 'culture', desc: 'Sự giao thoa độc đáo giữa kiến trúc Á-Âu.' },
    { name: 'Trại rắn Đồng Tâm', province: 'Tiền Giang', lat: 10.321, lng: 106.282, cat: 'nature', desc: 'Bảo tàng mãng xà lớn nhất miền Tây.' },
    { name: 'Chợ nổi Cái Bè', province: 'Tiền Giang', lat: 10.312, lng: 106.021, cat: 'culture', desc: 'Nơi giao thoa văn hóa sông nước tỉnh Tiền Giang.' },

    // Long An
    { name: 'Cánh đồng bất tận', province: 'Long An', lat: 10.582, lng: 106.052, cat: 'nature', desc: 'Phim trường của tác phẩm điện ảnh cùng tên.' },
    { name: 'Chùa Tôn Thạnh', province: 'Long An', lat: 10.612, lng: 106.612, cat: 'culture', desc: 'Nơi nhà thơ Nguyễn Đình Chiểu từng sống.' },

    // Hau Giang
    { name: 'Chợ nổi Ngã Bảy', province: 'Hậu Giang', lat: 9.852, lng: 105.821, cat: 'culture', desc: 'Ngã bảy Phụng Hiệp lừng danh qua bài ca vọng cổ.' },
    { name: 'Khu bảo tồn thiên nhiên Lung Ngọc Hoàng', province: 'Hậu Giang', lat: 9.752, lng: 105.652, cat: 'nature', desc: 'Lá phổi xanh của vùng đồng bằng sông Cửu Long.' },

    // Additional spots to hit 50
    { name: 'Cà phê Hẻm (Can Tho)', province: 'Cần Thơ', lat: 10.025, lng: 105.772, cat: 'coffee', desc: 'Góc cà phê chill giữa trung tâm Cần Thơ.' },
    { name: 'Azerai Can Tho Resort', province: 'Cần Thơ', lat: 10.038, lng: 105.798, cat: 'resort', desc: 'Khu nghỉ dưỡng sang trọng trên cồn Ấu.' },
    { name: 'Chùa Pitu Khôsâ Răngsây', province: 'Cần Thơ', lat: 10.031, lng: 105.782, cat: 'culture', desc: 'Ngôi chùa Khmer rực rỡ nhất Cần Thơ.' },
    { name: 'Victoria Nui Sam Lodge', province: 'An Giang', lat: 10.692, lng: 105.071, cat: 'resort', desc: 'Nghỉ dưỡng trên sườn núi Sam với view cánh đồng.' },
    { name: 'Làng bè Châu Đốc', province: 'An Giang', lat: 10.721, lng: 105.132, cat: 'nature', desc: 'Nét sinh hoạt đặc trưng trên dòng sông Châu Đốc.' },
    { name: 'Khu du lịch Phú An Khang', province: 'Bến Tre', lat: 10.222, lng: 106.352, cat: 'entertainment', desc: 'Thử thách làm nông dân miền Tây.' },
    { name: 'Bến Tre Riverside Resort', province: 'Bến Tre', lat: 10.231, lng: 106.372, cat: 'resort', desc: 'Nghỉ dưỡng ven sông Hàm Luông.' },
    { name: 'Mường Thanh Luxury Cần Thơ', province: 'Cần Thơ', lat: 10.045, lng: 105.788, cat: 'resort', desc: 'Khách sạn 5 sao cao nhất Cần Thơ.' },
    { name: 'Sáu Hoài Noodle Shop', province: 'Cần Thơ', lat: 10.012, lng: 105.742, cat: 'food', desc: 'Nổi tiếng với món pizza hủ tiếu độc lạ.' },
  ];

  for (const place of placesData) {
    const slug = place.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    const createdPlace = await prisma.place.upsert({
      where: { slug },
      update: {},
      create: {
        name: place.name,
        slug,
        description: place.desc,
        latitude: place.lat,
        longitude: place.lng,
        province: place.province,
        categoryId: catMap[place.cat],
        status: PlaceStatus.APPROVED,
        createdById: admin.id,
      },
    });

    // 4. Add some sample media links for some places
    if (place.name === 'Chợ nổi Cái Răng') {
      await prisma.placeMediaLink.upsert({
        where: { unique_place_media_url: { placeId: createdPlace.id, url: 'https://www.youtube.com/watch?v=0_u6Q1_T6H8' } },
        update: {},
        create: {
          placeId: createdPlace.id,
          url: 'https://www.youtube.com/watch?v=0_u6Q1_T6H8',
          embedUrl: 'https://www.youtube.com/embed/0_u6Q1_T6H8',
          platform: MediaPlatform.YOUTUBE,
          status: MediaStatus.APPROVED,
          submittedById: admin.id,
        },
      });
    }
    if (place.name === 'Rừng tràm Trà Sư') {
      await prisma.placeMediaLink.upsert({
        where: { unique_place_media_url: { placeId: createdPlace.id, url: 'https://www.youtube.com/watch?v=e_pI7B_lEGs' } },
        update: {},
        create: {
          placeId: createdPlace.id,
          url: 'https://www.youtube.com/watch?v=e_pI7B_lEGs',
          embedUrl: 'https://www.youtube.com/embed/e_pI7B_lEGs',
          platform: MediaPlatform.YOUTUBE,
          status: MediaStatus.APPROVED,
          submittedById: admin.id,
        },
      });
    }
  }

  console.log('✅ Seed finished with 50 locations across Mekong Delta.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
