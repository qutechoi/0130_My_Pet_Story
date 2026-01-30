# AI 이미지 생성 기능 가이드

## 개요

Gemini 3 Pro Image Preview 모델을 사용하여 반려동물 사진을 기반으로 9프레임의 고급 펫 포토그래피 스토리보드를 자동 생성합니다.

## 기능 설명

### 1. 3×3 그리드 자동 생성
업로드된 반려동물 사진을 참조 이미지로 사용하여, 동일한 동물의 9가지 다른 앵글/상황의 스토리보드 그리드를 한 번에 생성합니다.

### 2. 그리드 자동 분할
생성된 3×3 그리드 이미지를 Canvas API로 9등분하여 각 프레임별로 개별 이미지를 표시합니다.

### 3. 고품질 출력
- 해상도: 1024x1024 (1K)
- 스타일: DSLR 펫 포토그래피 (Canon EOS R5 / Sony A7R IV)
- 품질: 전문 포토그래피 등급

## 프롬프트 구조

### 그리드 생성 프롬프트
```
- 참조 이미지의 동물 특징(품종, 털 무늬, 눈 색, 체형) 완벽 유지
- 9개 프레임: 포트레이트 → 매크로 → 환경 → 인터랙션 → 탑다운 → 액션 → 디테일 → 실루엣 → 휴식
- 85mm/35mm 렌즈, 소프트 디퓨즈 조명
- 따뜻하고 시네마틱한 전문 펫 포토그래피 스타일
```

### 텍스트 분석 프롬프트
```
- 동물의 종, 품종, 털 무늬, 눈 색, 특징 식별
- 9프레임 각각에 대한 씬 제목, 시각적 설명, 액션, 분위기, 전환 효과 생성
- JSON 형식으로 구조화된 응답
```

## 기술 세부사항

### API 엔드포인트
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent
```

### 요청 구조
```json
{
  "contents": [{
    "role": "user",
    "parts": [
      { "text": "프롬프트" },
      { "inlineData": { "data": "base64...", "mimeType": "image/jpeg" } }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": { "imageSize": "1K" }
  }
}
```

### 응답 처리
- Base64 인코딩된 이미지 데이터 수신
- Data URL로 변환하여 브라우저에 표시
- Canvas API로 3×3 그리드를 9개 개별 이미지로 분할

## 에러 처리

| 오류 | 증상 | 해결 |
|------|------|------|
| API 키 오류 | "Gemini API is not initialized" | `.env` 파일 API 키 확인 |
| 네트워크 오류 | "Image generation failed: Network error" | 인터넷 연결 확인 |
| 할당량 초과 | "Quota exceeded" / 429 에러 | 잠시 후 재시도 |
| 응답 오류 | "No generated image found" | API 상태 확인, 재생성 |

## 성능

- **그리드 생성**: 30-60초
- **텍스트 분석**: 10-20초
- **그리드 분할**: 즉시 (클라이언트 Canvas 처리)

## 제한사항

1. 이미지 크기: 1024x1024 고정
2. 동시 생성: 1개씩만 가능
3. 편집 기능: 없음 (재생성만 가능)
4. 그리드 형식: 3×3 고정
