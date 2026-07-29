# QuizMotion 🎬

Tạo video quiz (trắc nghiệm) từ file **CSV** bằng [Remotion](https://remotion.dev).
Xuất **MP4** ở hai định dạng:

- **📱 Short / Reels** — dọc `9:16` (1080×1920), **một câu** mỗi video.
- **🖥️ YouTube ngang** — `16:9` (1920×1080), **nhiều câu** nối tiếp (có intro/outro).

Mỗi câu hỏi chạy theo trình tự: hiện câu hỏi + 4 đáp án → **đồng hồ đếm ngược** →
**tô sáng đáp án đúng** → **hiện giải thích**. Tuỳ chọn **lồng tiếng TTS tiếng Việt**.

Phong cách hình ảnh: Pop-art vàng/tím, font tiếng Việt (Quicksand + Be Vietnam Pro),
tất cả **self-hosted** nên render hoàn toàn offline, không phụ thuộc mạng.

---

## Cài đặt

```bash
npm install
```

Yêu cầu: Node.js ≥ 18. Remotion tự tải Chromium ở lần render đầu.

## Dữ liệu đầu vào

File CSV mặc định: [`data/multichoice.csv`](data/multichoice.csv). Cột:

| cột | ý nghĩa |
|-----|---------|
| `topic_slug` | mã chủ đề/bài (dùng để **lọc**) |
| `question` | câu hỏi |
| `A` `B` `C` `D` | 4 lựa chọn |
| `correct_answer` | đáp án đúng (`A`/`B`/`C`/`D`) |
| `explanation_vi` | giải thích (tiếng Việt) |
| `difficulty` | độ khó (`1`/`2`/`3`) — dùng để **lọc** |

Thay dữ liệu bằng cách chỉnh `data/multichoice.csv` (giữ nguyên tên cột) hoặc truyền
`--csv <đường-dẫn>`.

## Tạo video

### Cách 1 — CLI tương tác (khuyên dùng)

```bash
npm run generate
```

Trả lời các câu hỏi: định dạng → chủ đề → độ khó → số câu (ngang) hoặc chọn câu (short)
→ lồng tiếng. Video xuất ra thư mục `out/`.

### Cách 2 — Dòng lệnh (không tương tác)

```bash
# Short 9:16, chủ đề đầu tiên, câu số 1, có TTS
npm run generate -- --format short --topic 0 --question 0 --tts

# YouTube ngang, lọc theo topic_slug + độ khó, tối đa 10 câu
npm run generate -- --format landscape \
  --topic chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu \
  --difficulty 2 --limit 10 --tts
```

Tham số:

| cờ | mô tả |
|----|-------|
| `--format` | `short` \| `landscape` |
| `--topic` | `topic_slug` đầy đủ, hoặc chỉ số (0-based) trong danh sách chủ đề |
| `--difficulty` | `1`/`2`/`3` (bỏ trống = tất cả) |
| `--limit` | số câu tối đa cho video ngang (mặc định 10) |
| `--question` | (short) chỉ số câu trong nhóm đã lọc (mặc định 0) |
| `--tts` | bật lồng tiếng |
| `--no-explanation` | (khi bật TTS) không đọc phần giải thích |
| `--provider` | nhà cung cấp TTS (mặc định `google`) |
| `--bg` | ảnh nền: `auto` (mặc định, ngẫu nhiên) \| `none` \| danh sách `"a.jpg,b.png"` |
| `--cover` | (slide đầu) tên file bìa sách trong `public/covers/` |
| `--book` | (slide đầu) tên sách, vd `"Tin học 6 — Kết nối tri thức"` |
| `--subject` | (slide đầu) chủ đề, vd `"Chủ đề 5: Ứng dụng tin học"` |
| `--lesson` | (slide đầu) tựa bài, vd `"Bài 10 — Sơ đồ tư duy"` |
| `--csv` | đường dẫn CSV khác |
| `--out` | đường dẫn file MP4 đầu ra |

### Xem trước bằng Remotion Studio

```bash
npm run studio
```

Mở giao diện, chọn `QuizShort` hoặc `QuizLandscape`, chỉnh props và xem trước tức thì
(chế độ không audio để preview nhanh).

## Ảnh nền tuỳ chọn 🖼️

Mặc định nền được **vẽ bằng code** (pop-art tím/vàng động). Bạn có thể thay bằng
ảnh của mình:

1. Bỏ ảnh vào thư mục [`public/backgrounds/`](public/backgrounds/) (`.jpg`, `.png`,
   `.webp`, `.svg`…). Kích thước khuyến nghị: Short `1080×1920`, ngang `1920×1080`.
2. Chạy `npm run generate` — mỗi lần chạy sẽ **chọn/xáo trộn ngẫu nhiên** các ảnh
   (video ngang: mỗi câu + intro/outro lấy một ảnh theo thứ tự đã xáo).

Công cụ **không tự chèn logo** — bạn có thể gắn sẵn logo vào ảnh nền. Điều khiển
qua cờ `--bg auto|none|"a.jpg,b.png"`. Thư mục trống → dùng nền pop-art mặc định.

## Slide đầu (intro) 📘

Bạn có thể thêm thông tin (tất cả **optional**) hiển thị ở slide đầu của video ngang:

- **Bìa sách**: bỏ ảnh vào `public/covers/` (ảnh dọc ~2:3), chọn bằng `--cover <tên-file>`.
- **Tên sách / Chủ đề / Tựa bài**: `--book`, `--subject`, `--lesson` (nhập tiếng Việt có
  dấu — hữu ích vì `topic_slug` không có dấu). Ở CLI tương tác sẽ được hỏi trực tiếp.

Ví dụ:

```bash
npm run generate -- --format landscape --topic 9 --limit 10 \
  --cover book.png \
  --book "Tin học 6 — Kết nối tri thức" \
  --subject "Chủ đề 5: Ứng dụng tin học" \
  --lesson "Bài 10 — Sơ đồ tư duy"
```

Bỏ trống thì slide đầu tự dùng nhãn suy ra từ `topic_slug`.

## Lồng tiếng (TTS)

Mặc định dùng **Google Translate TTS** (miễn phí, không cần API key) qua HTTPS — cần máy
có kết nối Internet tới `translate.google.com`. Nếu TTS lỗi hoặc bị chặn, công cụ **tự
động chuyển sang thời lượng ước tính (không audio)** để vẫn xuất được video.

Tạo audio riêng (không render) và ghi manifest:

```bash
npm run tts -- --topic 0 --difficulty 2 --limit 10
```

### Thêm giọng đọc chất lượng cao

TTS được thiết kế **pluggable**. Để thêm giọng neural (vd Microsoft Edge TTS qua
`msedge-tts`, hoặc API trả phí), hiện thực interface `TtsProvider` trong
[`src/tts/index.ts`](src/tts/index.ts) và đăng ký với một `id` mới, rồi chạy với
`--provider <id>`.

## Cấu trúc dự án

```
data/multichoice.csv        Dữ liệu quiz
public/fonts/               Font self-hosted (Vietnamese)
public/backgrounds/         Ảnh nền tuỳ chọn của bạn (ngẫu nhiên mỗi lần gen)
public/covers/              Bìa sách tuỳ chọn (hiển thị ở slide đầu)
public/audio/               Audio TTS sinh ra (gitignored)
src/
  schema.ts                 Kiểu dữ liệu + props (zod)
  lib/csv.ts                Parse & lọc CSV
  lib/manifest.ts           Tính thời lượng các phase
  lib/theme.ts, fonts.ts    Màu sắc & font
  tts/                      Pipeline TTS (pluggable)
  components/               Scene & UI (QuestionScene, CountdownRing, …)
  compositions/             QuizShort, QuizLandscape
scripts/
  generate.ts               CLI tạo video
  tts-prepare.ts            Tạo audio + manifest
```

## Hướng phát triển thành website

Các module lõi (`src/lib`, `src/tts`) và render lập trình bằng `@remotion/renderer`
trong `scripts/generate.ts` được tách rời để tái sử dụng: có thể bọc thành một API
(upload CSV → chọn tham số → job render) và dùng
[`@remotion/lambda`](https://remotion.dev/lambda) hoặc một hàng đợi render phía server.
