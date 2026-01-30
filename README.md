# PetStory AI - 반려동물 스토리보드 생성기

반려동물 사진을 업로드하면 Google Gemini AI가 자동으로 3×3 고급 펫 포토그래피 스토리보드를 생성하는 React 웹 애플리케이션입니다.

## 주요 기능

- 📤 반려동물 사진 업로드 (드래그 앤 드롭 지원)
- 🤖 Google Gemini AI 기반 반려동물 분석 (품종, 털 색, 눈 색 등)
- 🎨 3×3 그리드 스토리보드 자동 생성 (9개 프레임)
- 🖼️ 그리드 이미지 자동 분할하여 각 프레임별 이미지 표시
- 📥 전체 그리드 및 개별 프레임 이미지 다운로드
- 📱 반응형 디자인
- 🌟 전문 펫 포토그래피 퀄리티

## 9프레임 구성

| 프레임 | 설명 |
|--------|------|
| 1 | 정면 포트레이트 (히어로샷) |
| 2 | 눈 또는 코 극접사 (매크로) |
| 3 | 거실 환경샷 (자연광) |
| 4 | 사람 손과의 인터랙션 |
| 5 | 탑다운 뷰 (하이앵글) |
| 6 | 액션샷 (동작 포착) |
| 7 | 발바닥/꼬리/귀 디테일 |
| 8 | 프로필 실루엣 (아트 라이팅) |
| 9 | 수면/휴식 장면 |

## 기술 스택

- React 18
- Vite 5
- Google Generative AI SDK
- Tailwind CSS (CDN)

## 설치 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Google Gemini API 키를 추가하세요:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Gemini API 키 발급 방법

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. Google 계정으로 로그인
3. "Get API Key" 클릭
4. 생성된 API 키를 복사하여 `.env` 파일에 붙여넣기

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 사용 방법

1. **랜딩 페이지** — "Tap to Upload" 또는 "Sign In" 클릭하여 시작
2. **사진 업로드** — 반려동물 사진을 드래그 앤 드롭하거나 클릭하여 선택 (JPG, PNG, WebP / 최대 5MB)
3. **스토리보드 생성** — "Done" 버튼 클릭 후 AI가 분석 및 3×3 그리드 생성 (약 30-60초)
4. **결과 확인** — 전체 그리드 이미지와 각 프레임별 상세 정보 확인
5. **다운로드** — 전체 그리드 또는 개별 프레임 이미지 다운로드
6. **재생성** — "Create New Storyboard" 버튼으로 다른 사진 시도

## 프로젝트 구조

```
src/
├── components/
│   ├── LandingPage.jsx         # 랜딩 페이지 (PetStory AI 디자인)
│   ├── ImageUploader.jsx       # 이미지 업로드 컴포넌트
│   ├── StoryboardDisplay.jsx   # 스토리보드 표시 + 그리드 분할
│   ├── FrameCard.jsx           # 개별 프레임 카드
│   └── LoadingSpinner.jsx      # 로딩 표시
├── services/
│   └── geminiService.js        # Gemini API 통신 (분석, 그리드 생성)
├── utils/
│   └── imageProcessor.js       # 이미지 유효성 검사
├── App.jsx                     # 메인 앱 (상태 관리)
├── App.css                     # 스타일
└── main.jsx                    # 엔트리 포인트
```

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

```bash
npm run preview
```

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| API 키 오류 | `.env` 파일의 `VITE_GEMINI_API_KEY` 확인 후 서버 재시작 |
| 이미지 업로드 실패 | 파일 크기 5MB 이하, JPG/PNG/WebP 형식 확인 |
| 스토리보드 생성 실패 | 인터넷 연결, Gemini API 할당량, 콘솔 에러 확인 |

## 라이선스

MIT
