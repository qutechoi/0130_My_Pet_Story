# PetStory AI - 테스트 가이드

## 사전 준비

### 1. API 키 설정
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 Gemini API 키 발급
2. `.env` 파일에 API 키 입력:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 2. 테스트 이미지 준비
다음과 같은 반려동물 이미지를 준비하세요:
- ✅ 강아지 (다양한 품종)
- ✅ 고양이
- ✅ 토끼, 새 등 기타 반려동물

이미지 요구사항:
- 포맷: JPG, PNG, WebP
- 크기: 5MB 이하
- 품질: 반려동물이 명확하게 보이는 고품질 이미지

## 수동 테스트 절차

### Phase 1: 기본 기능 테스트

#### 테스트 1: 애플리케이션 실행
```bash
npm run dev
```

**검증 사항:**
- [ ] 개발 서버가 정상적으로 시작됨
- [ ] http://localhost:5173 접속 가능
- [ ] PetStory AI 랜딩 페이지 표시
- [ ] "Turn Your Pet's Moments into a Story" 타이틀 표시

#### 테스트 2: 랜딩 페이지
- [ ] 헤더: PetStory AI 로고, Gallery/How it Works/Pricing/Sign In
- [ ] 업로드 영역: "Tap to Upload" 표시
- [ ] 갤러리 섹션: 3가지 스타일 카드 (Classic Comic, Dreamy Watercolor, Majestic Oil)
- [ ] How It Works: 3단계 표시
- [ ] 푸터: Privacy/Terms/Contact

#### 테스트 3: 이미지 업로드
1. 랜딩 페이지에서 업로드 영역 또는 Sign In 클릭
2. 반려동물 이미지 업로드 (드래그 앤 드롭 또는 클릭)

**검증 사항:**
- [ ] 파일 선택 가능
- [ ] 업로드 진행률 표시
- [ ] 이미지 갤러리에 썸네일 표시
- [ ] 체크박스 선택 가능
- [ ] "Done" 버튼 활성화

### Phase 2: 스토리보드 생성 테스트

#### 테스트 4: 정상 스토리보드 생성
1. 반려동물 이미지 업로드
2. "Done" 버튼 클릭
3. 결과 대기 (30-60초)

**검증 사항:**
- [ ] 로딩 스피너 표시
- [ ] "AI is analyzing your pet..." 메시지 표시
- [ ] 3×3 그리드 이미지 생성
- [ ] 그리드 다운로드 버튼 표시
- [ ] Frame Details에 9개 프레임 표시
- [ ] 각 프레임에 그리드에서 분할된 이미지 표시
- [ ] 각 프레임에 Visual Description / Action / Mood / Transition 정보 포함
- [ ] "Create New Storyboard" 버튼 표시

#### 테스트 5: 다양한 반려동물 테스트
1. **강아지** — 품종 특징(털 색, 귀 모양 등) 9프레임에서 일관성 유지
2. **고양이** — 눈 색, 무늬 패턴 일관성
3. **기타 동물** — 종류에 맞는 분석 결과

### Phase 3: 에러 처리 테스트

#### 테스트 6: API 키 없음
- [ ] 에러 메시지 표시
- [ ] "Try Again" 버튼 표시

#### 테스트 7: 잘못된 파일 형식
- [ ] "Only JPG, PNG, and WebP formats are supported." 에러 메시지

#### 테스트 8: 파일 크기 초과
- [ ] "File size must be 5MB or less." 에러 메시지

### Phase 4: UI/UX 테스트

#### 테스트 9: 반응형 디자인
- 데스크톱 (1920x1080)
- 태블릿 (768x1024)
- 모바일 (375x667)

**검증 사항:**
- [ ] 모든 화면 크기에서 레이아웃 정상
- [ ] 갤러리 섹션 가로 스크롤 (모바일)
- [ ] 그리드 이미지 적절한 크기

#### 테스트 10: 다운로드 기능
- [ ] 전체 그리드 이미지 다운로드
- [ ] 개별 프레임 이미지 다운로드
- [ ] 파일명 형식: `pet-storyboard-[name].png` / `frame-[N]-[title].png`

## 브라우저 호환성

- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)

## 알려진 제한사항

1. **API 할당량**: Gemini API 무료 티어 제한
2. **이미지 크기**: 최대 5MB
3. **생성 시간**: 30-60초 소요
4. **그리드 고정**: 3×3 형식만 지원
