// Mock dataset and a server emulation (filter, sort, paginate, count).
//
// This is the ONLY place fixtures live. `api/placesAPI.ts` is the seam: when the real API
// exists, that file changes and nothing else does. Keep the emulation honest — if the
// server would do it, do it here, not in a component.

import type { CursorParams } from '@/types/api';
import type {
  Area,
  LocationHit,
  PlaceDetail,
  PlaceCursorPage,
  Place,
  SearchQuery,
  Street,
  Ward,
} from '@/types/place';
import { normalizeVi } from '@/lib/normalize';

const PAGE_SIZE = 6;

export const AREAS: Area[] = [
  { id: 'q3', name: 'Quận 3', ward_count: 4 },
  { id: 'q1', name: 'Quận 1', ward_count: 5 },
  { id: 'bt', name: 'Bình Thạnh', ward_count: 6 },
  { id: 'pn', name: 'Phú Nhuận', ward_count: 3 },
];

// `old_name` carries the pre-2025 ward name. Searching it is the point of the location
// sheet: people still say "Phường Võ Thị Sáu" for what is now "Phường Xuân Hòa".
export const WARDS: Ward[] = [
  { id: 'xuanhoa', area_id: 'q3', name: 'Phường Xuân Hòa', old_name: 'Phường Võ Thị Sáu' },
  { id: 'banco', area_id: 'q3', name: 'Phường Bàn Cờ', old_name: 'Phường 3' },
  { id: 'nhieuloc', area_id: 'q3', name: 'Phường Nhiêu Lộc', old_name: 'Phường 7' },
  { id: 'vuonlai', area_id: 'q3', name: 'Phường Vườn Lài', old_name: 'Phường 9' },
  { id: 'bennghe', area_id: 'q1', name: 'Phường Bến Nghé' },
  { id: 'saigon', area_id: 'q1', name: 'Phường Sài Gòn', old_name: 'Phường Bến Thành' },
  { id: 'tandinh', area_id: 'q1', name: 'Phường Tân Định' },
  { id: 'binhthanh1', area_id: 'bt', name: 'Phường Gia Định', old_name: 'Phường 1' },
  { id: 'binhquoi', area_id: 'bt', name: 'Phường Bình Quới', old_name: 'Phường 28' },
  { id: 'phunhuan1', area_id: 'pn', name: 'Phường Đức Nhuận', old_name: 'Phường 10' },
];

export const STREETS: Street[] = [
  { id: 'vovantan', ward_id: 'xuanhoa', name: 'Võ Văn Tần' },
  { id: 'nguyendinhchieu', ward_id: 'xuanhoa', name: 'Nguyễn Đình Chiểu' },
  { id: 'cachmangthang8', ward_id: 'banco', name: 'Cách Mạng Tháng 8' },
  { id: 'nguyenthienthuat', ward_id: 'banco', name: 'Nguyễn Thiện Thuật' },
  { id: 'lychinhthang', ward_id: 'nhieuloc', name: 'Lý Chính Thắng' },
  { id: 'dongkhoi', ward_id: 'bennghe', name: 'Đồng Khởi' },
  { id: 'hatonmau', ward_id: 'saigon', name: 'Hàn Thuyên' },
  { id: 'phandinhphung', ward_id: 'phunhuan1', name: 'Phan Đình Phùng' },
];

interface MockPlace extends Place {
  ward_id: string;
  street_id: string;
  address: string;
  district: string;
  created_at: string;
}

function photo(seed: string): string {
  return `https://picsum.photos/seed/${seed}/640/400`;
}

export const PLACES: MockPlace[] = [
  {
    id: 'comtam-ba-ghe',
    name: 'Cơm tấm Bà Ghẻ',
    category: 'food',
    rating: 4.7,
    review_count: 1284,
    price_level: 1,
    avg_price_per_person: 45000,
    distance_m: 350,
    street: 'Võ Văn Tần',
    area_id: 'q3',
    ward_id: 'xuanhoa',
    street_id: 'vovantan',
    address: '84 Võ Văn Tần',
    district: 'Quận 3',
    is_open: true,
    closes_at: '22:30',
    is_24h: false,
    cover_photo_url: photo('comtam'),
    cover_caption: 'Cơm tấm sườn bì chả',
    tags: ['parking', 'aircon'],
    cuisine: 'comtam',
    status: 'approved',
    is_saved: false,
    lat: 10.7745,
    lng: 106.6905,
    created_at: '2024-03-02',
  },
  {
    id: 'pho-le',
    name: 'Phở Lệ',
    category: 'food',
    rating: 4.5,
    review_count: 862,
    price_level: 2,
    avg_price_per_person: 75000,
    distance_m: 620,
    street: 'Nguyễn Đình Chiểu',
    area_id: 'q3',
    ward_id: 'xuanhoa',
    street_id: 'nguyendinhchieu',
    address: '303 Nguyễn Đình Chiểu',
    district: 'Quận 3',
    is_open: true,
    closes_at: '23:00',
    is_24h: false,
    cover_photo_url: photo('phole'),
    cover_caption: 'Phở bò tái nạm',
    tags: ['aircon', 'group'],
    cuisine: 'pho',
    status: 'approved',
    is_saved: true,
    lat: 10.7721,
    lng: 106.6881,
    created_at: '2024-01-18',
  },
  {
    id: 'the-workshop',
    name: 'The Workshop Coffee',
    category: 'cafe',
    rating: 4.6,
    review_count: 2140,
    price_level: 3,
    avg_price_per_person: 165000,
    distance_m: 1800,
    street: 'Đồng Khởi',
    area_id: 'q1',
    ward_id: 'bennghe',
    street_id: 'dongkhoi',
    address: '27 Ngô Đức Kế',
    district: 'Quận 1',
    is_open: true,
    closes_at: '22:00',
    is_24h: false,
    cover_photo_url: photo('workshop'),
    cover_caption: 'Không gian tầng 2',
    tags: ['work', 'wifi', 'aircon', 'quiet'],
    cuisine: null,
    status: 'approved',
    is_saved: false,
    lat: 10.7745,
    lng: 106.7042,
    created_at: '2023-11-05',
  },
  {
    id: 'bun-bo-ganh',
    name: 'Bún bò Gánh',
    category: 'food',
    rating: 4.3,
    review_count: 410,
    price_level: 1,
    avg_price_per_person: 50000,
    distance_m: 900,
    street: 'Cách Mạng Tháng 8',
    area_id: 'q3',
    ward_id: 'banco',
    street_id: 'cachmangthang8',
    address: '110 Cách Mạng Tháng 8',
    district: 'Quận 3',
    is_open: false,
    opens_at: '06:00',
    is_24h: false,
    cover_photo_url: photo('bunbo'),
    cover_caption: 'Bún bò giò heo',
    tags: ['parking'],
    cuisine: 'bun',
    status: 'approved',
    is_saved: false,
    lat: 10.779,
    lng: 106.6845,
    created_at: '2024-06-21',
  },
  {
    id: 'ca-phe-ban-co',
    name: 'Cà phê Bàn Cờ',
    category: 'cafe',
    rating: 4.4,
    review_count: 318,
    price_level: 1,
    avg_price_per_person: 35000,
    distance_m: 480,
    street: 'Nguyễn Thiện Thuật',
    area_id: 'q3',
    ward_id: 'banco',
    street_id: 'nguyenthienthuat',
    address: '12 Nguyễn Thiện Thuật',
    district: 'Quận 3',
    is_open: true,
    is_24h: true,
    cover_photo_url: photo('banco'),
    cover_caption: 'Cà phê sữa đá',
    tags: ['outdoor', 'late', 'parking'],
    cuisine: null,
    status: 'approved',
    is_saved: false,
    lat: 10.7681,
    lng: 106.6823,
    created_at: '2025-02-14',
  },
  {
    id: 'banh-mi-huynh-hoa',
    name: 'Bánh mì Huỳnh Hoa',
    category: 'food',
    rating: 4.2,
    review_count: 3902,
    price_level: 2,
    avg_price_per_person: 68000,
    distance_m: 1500,
    street: 'Lê Thị Riêng',
    area_id: 'q1',
    ward_id: 'saigon',
    street_id: 'hatonmau',
    address: '26 Lê Thị Riêng',
    district: 'Quận 1',
    is_open: true,
    closes_at: '23:00',
    is_24h: false,
    cover_photo_url: photo('banhmi'),
    cover_caption: 'Bánh mì thịt đặc biệt',
    tags: ['late'],
    cuisine: 'banhmi',
    status: 'approved',
    is_saved: false,
    lat: 10.7703,
    lng: 106.6916,
    created_at: '2023-08-30',
  },
  {
    id: 'lau-de-nam-loi',
    name: 'Lẩu dê Năm Lợi',
    category: 'food',
    rating: 4.1,
    review_count: 221,
    price_level: 3,
    avg_price_per_person: 220000,
    distance_m: 2400,
    street: 'Lý Chính Thắng',
    area_id: 'q3',
    ward_id: 'nhieuloc',
    street_id: 'lychinhthang',
    address: '47 Lý Chính Thắng',
    district: 'Quận 3',
    is_open: true,
    closes_at: '23:30',
    is_24h: false,
    cover_photo_url: photo('laude'),
    cover_caption: 'Lẩu dê thuốc bắc',
    tags: ['group', 'parking', 'aircon'],
    cuisine: 'lau',
    status: 'approved',
    is_saved: false,
    lat: 10.7872,
    lng: 106.6854,
    created_at: '2024-09-12',
  },
  {
    id: 'oromia-coffee',
    name: 'Oromia Coffee & Lounge',
    category: 'cafe',
    rating: 4.5,
    review_count: 1180,
    price_level: 2,
    avg_price_per_person: 95000,
    distance_m: 3200,
    street: 'Phan Đình Phùng',
    area_id: 'pn',
    ward_id: 'phunhuan1',
    street_id: 'phandinhphung',
    address: '90 Phan Đình Phùng',
    district: 'Phú Nhuận',
    is_open: true,
    closes_at: '22:30',
    is_24h: false,
    cover_photo_url: photo('oromia'),
    cover_caption: 'Góc làm việc yên tĩnh',
    tags: ['work', 'wifi', 'aircon', 'quiet', 'parking'],
    cuisine: null,
    status: 'approved',
    is_saved: false,
    lat: 10.7968,
    lng: 106.6798,
    created_at: '2024-04-08',
  },
  {
    id: 'com-chay-tue-tam',
    name: 'Cơm chay Tuệ Tâm',
    category: 'food',
    rating: 4.0,
    review_count: 96,
    price_level: 1,
    avg_price_per_person: 40000,
    distance_m: 1100,
    street: 'Nguyễn Đình Chiểu',
    area_id: 'q3',
    ward_id: 'xuanhoa',
    street_id: 'nguyendinhchieu',
    address: '175 Nguyễn Đình Chiểu',
    district: 'Quận 3',
    is_open: false,
    opens_at: '10:00',
    is_24h: false,
    cover_photo_url: photo('comchay'),
    cover_caption: 'Cơm chay phần',
    tags: ['quiet'],
    cuisine: 'chay',
    status: 'approved',
    is_saved: false,
    lat: 10.7735,
    lng: 106.6889,
    created_at: '2025-05-19',
  },
  {
    id: 'hai-san-bien-xanh',
    name: 'Hải sản Biển Xanh',
    category: 'food',
    rating: null,
    review_count: 0,
    price_level: 2,
    avg_price_per_person: 150000,
    distance_m: 2900,
    street: 'Bình Quới',
    area_id: 'bt',
    ward_id: 'binhquoi',
    street_id: 'phandinhphung',
    address: '18 Bình Quới',
    district: 'Bình Thạnh',
    is_open: true,
    closes_at: '22:00',
    is_24h: false,
    tags: ['outdoor', 'group'],
    cuisine: 'haisan',
    status: 'pending',
    is_saved: false,
    lat: 10.8295,
    lng: 106.7336,
    created_at: '2025-10-12',
  },
  {
    id: 'bo-nuong-la-lot',
    name: 'Bò nướng lá lốt Cô Liên',
    category: 'food',
    rating: 4.6,
    review_count: 540,
    price_level: 2,
    avg_price_per_person: 120000,
    distance_m: 760,
    street: 'Võ Văn Tần',
    area_id: 'q3',
    ward_id: 'xuanhoa',
    street_id: 'vovantan',
    address: '220 Võ Văn Tần',
    district: 'Quận 3',
    is_open: true,
    closes_at: '23:00',
    is_24h: false,
    cover_photo_url: photo('bonuong'),
    cover_caption: 'Bò nướng lá lốt',
    tags: ['outdoor', 'group', 'late'],
    cuisine: 'nuong',
    status: 'approved',
    is_saved: false,
    lat: 10.7759,
    lng: 106.6873,
    created_at: '2024-07-30',
  },
  {
    id: 'the-coffee-house-vvt',
    name: 'The Coffee House Võ Văn Tần',
    category: 'cafe',
    rating: 4.2,
    review_count: 1640,
    price_level: 2,
    avg_price_per_person: 60000,
    distance_m: 410,
    street: 'Võ Văn Tần',
    area_id: 'q3',
    ward_id: 'xuanhoa',
    street_id: 'vovantan',
    address: '86 Võ Văn Tần',
    district: 'Quận 3',
    is_open: true,
    closes_at: '22:00',
    is_24h: false,
    cover_photo_url: photo('tch'),
    cover_caption: 'Tầng 1 nhiều ổ điện',
    tags: ['work', 'wifi', 'aircon'],
    cuisine: null,
    status: 'approved',
    is_saved: false,
    lat: 10.7751,
    lng: 106.6898,
    created_at: '2023-12-01',
  },
  {
    id: 'bun-thit-nuong-chi-tuyen',
    name: 'Bún thịt nướng Chị Tuyền',
    category: 'food',
    rating: 4.4,
    review_count: 298,
    price_level: 1,
    avg_price_per_person: 42000,
    distance_m: 1300,
    street: 'Nguyễn Thiện Thuật',
    area_id: 'q3',
    ward_id: 'banco',
    street_id: 'nguyenthienthuat',
    address: '60 Nguyễn Thiện Thuật',
    district: 'Quận 3',
    is_open: false,
    opens_at: '15:00',
    is_24h: false,
    cover_photo_url: photo('bunthitnuong'),
    cover_caption: 'Bún thịt nướng chả giò',
    tags: ['parking'],
    cuisine: 'bun',
    status: 'approved',
    is_saved: false,
    lat: 10.7669,
    lng: 106.6819,
    created_at: '2025-01-09',
  },
  {
    id: 'ca-phe-do-phu',
    name: 'Cà phê Đỗ Phủ',
    category: 'cafe',
    rating: 4.3,
    review_count: 760,
    price_level: 1,
    avg_price_per_person: 38000,
    distance_m: 1950,
    street: 'Đặng Dung',
    area_id: 'q1',
    ward_id: 'tandinh',
    street_id: 'hatonmau',
    address: '113A Đặng Dung',
    district: 'Quận 1',
    is_open: true,
    closes_at: '21:30',
    is_24h: false,
    cover_photo_url: photo('dophu'),
    cover_caption: 'Nhà cổ biệt động Sài Gòn',
    tags: ['quiet', 'outdoor'],
    cuisine: null,
    status: 'approved',
    is_saved: false,
    lat: 10.7925,
    lng: 106.6908,
    created_at: '2024-02-27',
  },
];

function matchesQuery(place: MockPlace, query: SearchQuery): boolean {
  const { filters } = query;

  if (query.category !== 'all' && place.category !== query.category) {
    return false;
  }
  if (query.area_id !== undefined && place.area_id !== query.area_id) {
    return false;
  }
  if (query.ward_id !== undefined && place.ward_id !== query.ward_id) {
    return false;
  }
  if (query.street_id !== undefined && place.street_id !== query.street_id) {
    return false;
  }
  if (query.q !== undefined && query.q !== '') {
    const needle = normalizeVi(query.q);
    const haystack = normalizeVi(`${place.name} ${place.cuisine ?? ''} ${place.street}`);
    if (!haystack.includes(needle)) {
      return false;
    }
  }
  if (filters.price_levels.length > 0 && !filters.price_levels.includes(place.price_level)) {
    return false;
  }
  if (filters.cuisines.length > 0) {
    if (place.cuisine === null || place.cuisine === undefined) {
      return false;
    }
    if (!filters.cuisines.includes(place.cuisine)) {
      return false;
    }
  }
  // Amenity filters are AND: asking for wifi AND parking means both.
  if (filters.tag_keys.some((key) => !place.tags.includes(key))) {
    return false;
  }
  if (filters.open_now && !place.is_open) {
    return false;
  }
  if (filters.open_24h && !place.is_24h) {
    return false;
  }
  if (filters.open_late && !place.is_24h && (place.closes_at ?? '00:00') <= '22:00') {
    return false;
  }
  if (filters.radius_m !== undefined && place.distance_m > filters.radius_m) {
    return false;
  }
  if (filters.min_rating !== undefined && (place.rating ?? 0) < filters.min_rating) {
    return false;
  }

  return true;
}

function compare(a: MockPlace, b: MockPlace, sort: SearchQuery['sort']): number {
  switch (sort) {
    case 'nearest':
      return a.distance_m - b.distance_m;
    case 'rating':
      return (b.rating ?? 0) - (a.rating ?? 0);
    case 'price_asc':
      return a.avg_price_per_person - b.avg_price_per_person;
    case 'price_desc':
      return b.avg_price_per_person - a.avg_price_per_person;
    case 'newest':
      return b.created_at.localeCompare(a.created_at);
    case 'name':
      return a.name.localeCompare(b.name, 'vi');
    case 'open_first':
      return Number(b.is_open) - Number(a.is_open);
    case 'relevant':
    default:
      // Relevance stands in as rating weighted by review volume.
      return (
        (b.rating ?? 0) * Math.log1p(b.review_count) - (a.rating ?? 0) * Math.log1p(a.review_count)
      );
  }
}

function selectPlaces(query: SearchQuery): MockPlace[] {
  return PLACES.filter((place) => {
    return matchesQuery(place, query);
  }).sort((a, b) => {
    return compare(a, b, query.sort);
  });
}

export function queryPlaceCount(query: SearchQuery): number {
  return selectPlaces(query).length;
}

export function queryPlaces(query: SearchQuery, params: CursorParams = {}): PlaceCursorPage {
  const matched = selectPlaces(query);
  const limit = params.limit ?? PAGE_SIZE;
  // A real backend decodes an opaque cursor; the mock uses the offset as its payload.
  const start = params.cursor === undefined ? 0 : Number(params.cursor);
  const next = start + limit;

  return {
    items: matched.slice(start, next),
    next_cursor: next < matched.length ? String(next) : undefined,
    total: matched.length,
    limit,
  };
}

const MEDIA_CAPTIONS = [
  { category: 'food' as const, caption: 'Món chính' },
  { category: 'space' as const, caption: 'Không gian tầng 1' },
  { category: 'food' as const, caption: 'Món ăn kèm' },
  { category: 'menu' as const, caption: 'Thực đơn' },
  { category: 'video' as const, caption: 'Quay nhanh quán' },
  { category: 'space' as const, caption: 'Chỗ ngồi ngoài trời' },
  { category: 'food' as const, caption: 'Đồ uống' },
  { category: 'space' as const, caption: 'Mặt tiền quán' },
];

export function queryPlace(id: string): PlaceDetail | null {
  const place = PLACES.find((candidate) => {
    return candidate.id === id;
  });

  if (place === undefined) {
    return null;
  }

  const media =
    place.status === 'pending'
      ? []
      : MEDIA_CAPTIONS.map((entry, index) => {
          return {
            id: `${place.id}-m${index}`,
            url: photo(`${place.id}-${index}`),
            category: entry.category,
            caption: entry.caption,
            is_video: entry.category === 'video',
            duration_sec: entry.category === 'video' ? 24 : undefined,
            source: index % 3 === 0 ? ('owner' as const) : ('guest' as const),
          };
        });

  return { ...place, media };
}

export function queryLocations(term: string): LocationHit[] {
  const needle = normalizeVi(term);
  if (needle === '') {
    return [];
  }

  const hits: LocationHit[] = [];

  for (const area of AREAS) {
    if (normalizeVi(area.name).includes(needle)) {
      hits.push({ kind: 'area', area });
    }
  }

  for (const ward of WARDS) {
    const area = AREAS.find((candidate) => {
      return candidate.id === ward.area_id;
    });
    if (area === undefined) {
      continue;
    }

    const byName = normalizeVi(ward.name).includes(needle);
    const byOldName = ward.old_name !== undefined && normalizeVi(ward.old_name).includes(needle);

    if (byName || byOldName) {
      // A hit found only through the former name is what earns the "Tên mới" badge.
      hits.push({ kind: 'ward', ward, area, matched_old_name: !byName && byOldName });
    }
  }

  for (const street of STREETS) {
    if (!normalizeVi(street.name).includes(needle)) {
      continue;
    }
    const ward = WARDS.find((candidate) => {
      return candidate.id === street.ward_id;
    });
    if (ward === undefined) {
      continue;
    }
    const area = AREAS.find((candidate) => {
      return candidate.id === ward.area_id;
    });
    if (area === undefined) {
      continue;
    }

    hits.push({ kind: 'street', street, ward, area });
  }

  return hits;
}

// Stands in for a reverse-geocode call: nearest place wins, and we report its ward.
export function queryNearest(lat: number, lng: number): { area_id: string; ward_id: string } {
  let best: MockPlace | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const place of PLACES) {
    const distance = (place.lat - lat) ** 2 + (place.lng - lng) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = place;
    }
  }

  return { area_id: best?.area_id ?? 'q3', ward_id: best?.ward_id ?? 'xuanhoa' };
}
