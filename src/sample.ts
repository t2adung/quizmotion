import type { Question, QuizProps } from "./schema";

/**
 * A small slice of the real dataset, embedded so Remotion Studio can preview
 * both compositions with zero setup (no filesystem read, no TTS). The CLI /
 * render path always passes real props, so this is preview-only.
 */
export const SAMPLE_QUESTIONS: Question[] = [
  {
    topic_slug: "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu",
    question: 'Theo bài học, "Thông tin" là gì?',
    A: "Những gì đem lại hiểu biết cho con người về thế giới.",
    B: "Các con số, văn bản, hình ảnh, âm thanh thu nhận được.",
    C: "Phương tiện dùng để lưu trữ và truyền tải thông tin.",
    D: "Các hoạt động của con người trong cuộc sống.",
    correct_answer: "A",
    explanation_vi:
      "Thông tin là những gì đem lại hiểu biết cho con người về thế giới.",
    difficulty: 1,
  },
  {
    topic_slug: "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu",
    question: "Khi thông tin được ghi lên vật mang tin, nó sẽ trở thành gì?",
    A: "Một dạng hiểu biết mới.",
    B: "Dữ liệu.",
    C: "Một loại vật mang tin khác.",
    D: "Một thông điệp.",
    correct_answer: "B",
    explanation_vi:
      "Theo bài học, thông tin được ghi lên vật mang tin sẽ trở thành dữ liệu.",
    difficulty: 2,
  },
  {
    topic_slug: "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu",
    question: "Dữ liệu có thể được thể hiện dưới những dạng nào?",
    A: "Chỉ có con số và văn bản.",
    B: "Các cảm xúc và suy nghĩ của con người.",
    C: "Con số, văn bản, hình ảnh và âm thanh.",
    D: "Chỉ có hình ảnh và âm thanh.",
    correct_answer: "C",
    explanation_vi:
      "Dữ liệu là các con số, văn bản, hình ảnh, âm thanh thu nhận được.",
    difficulty: 1,
  },
  {
    topic_slug: "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu",
    question: '"Vật mang tin" được định nghĩa là gì?',
    A: "Những gì đem lại hiểu biết cho con người.",
    B: "Các con số, văn bản, hình ảnh, âm thanh.",
    C: "Bộ não con người để xử lí thông tin.",
    D: "Phương tiện dùng để lưu trữ và truyền tải thông tin.",
    correct_answer: "D",
    explanation_vi:
      "Vật mang tin là phương tiện dùng để lưu trữ và truyền tải thông tin.",
    difficulty: 1,
  },
  {
    topic_slug: "chu-de-1-may-tinh-va-cong-dong-bai-1-thong-tin-va-du-lieu",
    question: "Mối quan hệ chính giữa dữ liệu và thông tin là gì?",
    A: "Dữ liệu đem lại thông tin cho con người.",
    B: "Thông tin là kết quả của việc xử lí dữ liệu.",
    C: "Thông tin và dữ liệu là hai khái niệm hoàn toàn độc lập.",
    D: "Dữ liệu chỉ trở thành thông tin khi được máy tính xử lí.",
    correct_answer: "A",
    explanation_vi:
      "Dữ liệu là 'nguyên liệu thô', thông tin là 'sản phẩm đã chế biến'. Dữ liệu đem lại thông tin cho con người.",
    difficulty: 2,
  },
];

export const sampleProps = (count: number): QuizProps => ({
  questions: SAMPLE_QUESTIONS.slice(0, count),
  clips: [],
  readSeconds: 3,
  countdownSeconds: 5,
  revealSeconds: 2.5,
  explanationSeconds: 4,
  title: "Quiz Time",
  subtitle: "Chủ đề 1 · Bài 1 — Thông tin và dữ liệu",
  backgrounds: [],
  cover: null,
  book: "Tin học 6 — Kết nối tri thức",
  subject: "Chủ đề 1: Máy tính và cộng đồng",
  lesson: "Bài 1 — Thông tin và dữ liệu",
});
