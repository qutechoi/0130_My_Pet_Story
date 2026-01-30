# PetStory AI

반려동물 사진과 스토리를 입력하면 Google Gemini AI가 맞춤형 3×3 펫 포토그래피 스토리보드를 생성하는 React 웹 애플리케이션입니다.

## 주요 기능

- 📤 반려동물 사진 업로드 (드래그 앤 드롭 지원)
- ✍️ 사용자 스토리 입력 (빠른 제안 칩 제공)
- 🌐 한국어/영어 전환 (UI 및 AI 생성 콘텐츠 모두 적용)
- 🤖 Google Gemini AI 기반 반려동물 분석 및 스토리 기반 9프레임 구성
- 🎨 3×3 그리드 스토리보드 자동 생성
- 🖼️ 그리드 이미지 자동 분할하여 각 프레임별 이미지 표시
- 📥 전체 그리드 및 개별 프레임 이미지 다운로드
- 🌙 다크 테마 UI

## 사용 흐름

1. **랜딩 페이지** — 언어 선택 (한국어/English), 사진 업로드, 스토리 입력
2. **스토리 입력** — 반려동물의 이야기나 원하는 장면 설명 (선택사항)
3. **생성** — "Generate Magic Story" 버튼 클릭, AI가 스토리에 맞는 9프레임 구성 (약 30-60초)
4. **결과 확인** — 히어로 이미지, 스토리 텍스트, 3×3 그리드, 프레임 상세 정보
5. **다운로드/공유** — "Save Story" 버튼으로 그리드 이미지 다운로드
6. **재생성** — "Generate New Variant" 버튼으로 새로운 스토리보드 생성

## 기술 스택

- React 18
- Vite 5
- Google Generative AI SDK (Gemini 3 Pro Image Preview)
- Tailwind CSS (CDN)
- Material Symbols

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

## 프로젝트 구조

```
src/
├── components/
│   ├── LandingPage.jsx         # 랜딩 페이지 (사진 업로드 + 스토리 입력 + 언어 전환)
│   ├── ImageUploader.jsx       # 이미지 업로드 컴포넌트
│   ├── StoryInput.jsx          # 스토리 입력 컴포넌트
│   ├── StoryboardDisplay.jsx   # 결과 표시 (히어로 이미지 + 스토리 + 그리드)
│   ├── FrameCard.jsx           # 개별 프레임 카드
│   └── LoadingSpinner.jsx      # 로딩 표시
├── services/
│   └── geminiService.js        # Gemini API 통신 (분석, 그리드 생성, 다국어)
├── utils/
│   └── imageProcessor.js       # 이미지 유효성 검사
├── i18n.js                     # 다국어 번역 (한국어/영어)
├── App.jsx                     # 메인 앱 (상태 관리, 라우팅)
├── App.css                     # 스타일
└── main.jsx                    # 엔트리 포인트
```

## 빌드

```bash
npm run build
```

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| API 키 오류 | `.env` 파일의 `VITE_GEMINI_API_KEY` 확인 후 서버 재시작 |
| 이미지 업로드 실패 | 파일 크기 5MB 이하, JPG/PNG/WebP 형식 확인 |
| 스토리보드 생성 실패 | 인터넷 연결, Gemini API 할당량, 콘솔 에러 확인 |

## 라이선스

MIT
