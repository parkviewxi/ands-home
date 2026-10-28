# 홈페이지 개편 — 운영·롤백 안내

## 구조
- 배포: GitHub Pages, `main` 브랜치 루트가 그대로 서비스됨 (CNAME: www.andsquare.co.kr)
- 개편 작업 브랜치: `redesign`
- 개편 전 사이트 보존: 태그 `legacy-v1`, 브랜치 `legacy-v1` (동일 커밋)

## 페이지 수정 방법
1. `src/pages/*.html` (본문) 또는 `src/partials/*.html` (헤더·푸터·head)을 수정
2. `node tools/build.mjs` 실행 → 루트의 `*.html`과 `sitemap.xml`이 다시 생성됨
3. 루트 HTML을 직접 고치지 말 것 (빌드 시 덮어씀)

## 롤백 (개편 전으로 되돌리기)
개편을 `main`에 반영한 뒤 문제가 있으면 둘 중 하나로 되돌립니다.

### 방법 A — 되돌림 커밋 (권장, 이력 보존)
```
git checkout main
git revert -m 1 <개편 병합 커밋 해시>
git push origin main
```

### 방법 B — 태그 시점으로 강제 복귀 (긴급 시)
```
git checkout main
git reset --hard legacy-v1
git push --force origin main
```
GitHub Pages는 push 후 1~2분 안에 반영됩니다. DNS·CNAME은 바꾸지 않았으므로 추가 조치가 없습니다.

## 개편 반영 절차
```
git checkout main
git merge --no-ff redesign -m "개편 반영"
git push origin main
```
병합 전 `redesign` 브랜치를 로컬에서 열어 확인: `python -m http.server 8000` 후 http://localhost:8000

## 보안 관련 메모
- CSP는 `<meta http-equiv>`로 선언되어 있으므로 인라인 `style=`/`onclick=`을 쓰면 브라우저가 차단함. 스타일은 `css/site.css`의 유틸리티 클래스로 처리
- 외부 스크립트·폰트·이미지 없음 (Pretendard 자체 호스팅, `fonts/`)
- 폼 없음. 문의는 mailto 링크
