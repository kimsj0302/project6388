# Project 6388 — Website

카드 기반 보드게임 실험 아카이브 웹사이트. 한국어/영어 다국어 지원.

- **About** (`/en`, `/ko`) — 프로젝트 소개, 설계 원칙, 운영 방식
- **Games** (`/en/games`, `/ko/games`) — 게임 목록, 상태 필터, 다운로드 버튼
- `/` → 기본 언어(`/en`)로 리다이렉트

## Tech Stack

| 항목 | 선택 |
|------|------|
| Framework | Next.js (App Router, TypeScript) |
| Hosting | Vercel (static export) |
| File hosting | GitHub Releases (per-game repo) |
| Data source | `data/games.json` |
| i18n | Path-based (`/en/`, `/ko/`), English fallback |

## Folder Structure

```
app/
  layout.tsx                # 루트 레이아웃 (최소)
  globals.css               # 전역 스타일
  page.tsx                  # / → /en 리다이렉트
  [locale]/
    layout.tsx              # 로케일별 레이아웃 + 네비게이션
    language-switcher.tsx   # 언어 전환 UI (클라이언트)
    page.tsx                # About 페이지
    games/
      page.tsx              # Games 서버 컴포넌트
      games-client.tsx      # 필터 + 카드 클라이언트 컴포넌트
i18n/
  config.ts                 # 로케일 정의 (en, ko)
  get-dictionary.ts         # 딕셔너리 로더 + 폴백
  dictionaries/
    en.json                 # 영어 UI 텍스트
    ko.json                 # 한국어 UI 텍스트
data/
  games.json                # 게임 목록 (다국어 title/summary)
lib/
  types.ts                  # TypeScript 타입 + localize 헬퍼
  downloads.ts              # 다운로드 URL 빌더
public/
  images/games/             # 게임 카드 이미지
```

## i18n (다국어)

- 경로 기반: `/en/...`, `/ko/...`
- 기본 언어: **영어 (`en`)**
- 번역이 없는 필드는 영어로 자동 폴백

### 새 언어 추가 방법

1. `i18n/config.ts`의 `locales` 배열에 새 로케일 추가 (예: `"ja"`)
2. `i18n/dictionaries/ja.json` 생성 (`en.json`을 복사해 번역)
3. `i18n/get-dictionary.ts`에 `import ja from "./dictionaries/ja.json"` 추가
4. `games.json`의 `title`, `summary`에 `"ja"` 키 추가 (선택 — 없으면 영어 표시)
5. `app/[locale]/language-switcher.tsx`의 `LOCALE_LABELS`에 추가

## games.json Schema

```jsonc
[
  {
    "code": "mimas",                        // 토성 위성 코드명
    "title": {                              // 다국어 제목
      "en": "(WIP) Shadow Market",
      "ko": "(WIP) Shadow Market"
    },
    "status": "playtest",                   // prototype | playtest | stable
    "version": "v0.5",                      // 표시용 버전
    "summary": {                            // 다국어 설명
      "en": "English description",
      "ko": "한국어 설명"
    },
    "repo": "<GITHUB_OWNER>/p6388-mimas",   // GitHub repo 전체 이름
    "image": "/images/games/mimas.png",     // (선택) 게임 카드 이미지
    "downloads": {
      "rulebook_asset": "rulebook.pdf",     // Release 고정 파일명
      "pnp_asset": "pnp.zip"
    }
  }
]
```

> `title`과 `summary`의 `en` 키는 **필수**, 다른 로케일은 선택입니다.
> 빠진 로케일은 영어로 자동 폴백됩니다.

## Download URL Rules

웹사이트 다운로드 버튼은 아래 패턴의 URL을 가리킵니다:

```
https://github.com/<owner>/<repo>/releases/latest/download/<asset>
```

이를 위해 **Release에 첨부하는 파일명은 항상 고정**합니다 (`rulebook.pdf`, `pnp.zip`).  
버전 표기는 `games.json`의 `version` 필드로만 관리합니다.

## Maintenance Checklist

### 새 게임 추가

1. 코드명 선택 (토성 위성 이름, 예: `tethys`)
2. GitHub repo 생성: `p6388-tethys`
3. 첫 Release 생성 → `rulebook.pdf`, `pnp.zip` 첨부
4. (선택) 게임 이미지를 `public/images/games/tethys.png`에 추가
5. `data/games.json`에 항목 1개 추가 (`en` 필수, 다른 언어는 선택)
6. Push → Vercel 자동 배포

### 기존 게임 업데이트 (새 버전)

1. 게임 repo에서 새 Release 생성
2. 동일 파일명으로 `rulebook.pdf`, `pnp.zip` 업로드
3. `data/games.json`의 `version` 필드만 업데이트
4. Push → Vercel 자동 배포

> 다운로드 버튼 URL은 **절대 바꿀 필요 없음** — `latest` 릴리즈를 자동으로 가리킵니다.

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # 정적 빌드 (out/)
npm run lint      # ESLint
```

## Deployment

Vercel에 GitHub 레포를 연결하면 `main` 브랜치 푸시 시 자동 배포됩니다.  
별도의 `vercel.json` 설정 없이 Next.js 자동 감지로 동작합니다.
