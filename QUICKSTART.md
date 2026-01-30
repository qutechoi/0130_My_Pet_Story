# 빠른 시작 가이드

PetStory AI를 5분 안에 실행하는 방법을 안내합니다.

## 1단계: API 키 발급 (2분)

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. **"Get API Key"** 또는 **"Create API Key"** 클릭
4. API 키 복사 (예: `AIzaSyD...`)

## 2단계: 환경 설정 (1분)

프로젝트 루트의 `.env` 파일을 열고 API 키 입력:

```env
VITE_GEMINI_API_KEY=여기에_복사한_API_키_붙여넣기
```

## 3단계: 애플리케이션 실행 (1분)

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 4단계: 스토리보드 생성 (1분)

1. **언어 선택**: 상단 네비게이션에서 한국어/English 전환
2. **사진 업로드**: 반려동물 사진을 드래그 앤 드롭하거나 "Select Image" 클릭
3. **스토리 입력**: 원하는 이야기를 작성하거나 빠른 제안 칩 선택 (선택사항)
4. **생성**: "Generate Magic Story" 버튼 클릭
5. **결과 확인**: 30-60초 후 스토리와 3×3 그리드 결과 확인

## 완료!

---

## 문제 해결

### "API is not initialized" 에러
- `.env` 파일에 API 키 확인
- 개발 서버 재시작 (`Ctrl+C` → `npm run dev`)

### 이미지 업로드 안됨
- 파일 형식: JPG, PNG, WebP만 가능
- 파일 크기: 5MB 이하

### 스토리보드 생성 실패
- 인터넷 연결 확인
- API 키 유효성 확인
- Gemini API 할당량 확인 (무료: 분당 60회)
