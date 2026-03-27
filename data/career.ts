export interface CareerItem {
  date: string;
  company: string;
  role: string;
  description?: string;
}

export const career: CareerItem[] = [
  {
    date: "2020.03 — 2023.02",
    company: "오산정보고등학교",
    role: "IT콘텐츠과 졸업",
    description:
      "IT 특성화고에서 네트워크, 운영체제 등 CS 기초를 학습. 전공 수업을 통해 개발의 첫 발을 내딛었습니다.",
  },
];
