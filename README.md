## TanStack Router Issue

## `history.go` does not respect `ignoreBlocker` option

### Summary

When using TanStack Router with `BrowserHistory`, the `ignoreBlocker` option works as expected for `history.back` and `history.forward`, but **does not work for `history.go`**. This means that navigation blockers are still triggered even when `ignoreBlocker: true` is passed to `history.go`.

### Details

- In the source code, both `back` and `forward` methods set the `skipBlockerNextPop` flag to `true` when `ignoreBlocker` is provided, allowing navigation to bypass blockers.
- However, the `go` method does **not** set this flag, so blockers are always executed, regardless of the `ignoreBlocker` option.
- This makes it impossible to programmatically skip blockers when navigating multiple steps in history using `go`.

### Steps to Reproduce the Bug or Issue

1. Create a route (e.g., `/two`) that uses a blocker with `useBlocker`:

   ```tsx
   function Two() {
     useBlocker({
       shouldBlockFn: () => {
         return !confirm("Are you sure you want to leave?");
       },
     });

     const router = useRouter();

     const handleBack = () => {
       router.history.back({
         ignoreBlocker: true,
       });
     };

     const handleGo = () => {
       router.history.go(-1, {
         ignoreBlocker: true,
       });
     };

     return (
       <div>
         <h1>Hello "/two"!</h1>
         <button onClick={handleBack}>Back</button>
         <button onClick={handleGo}>Go(-1)</button>
       </div>
     );
   }
   ```

2. Add two buttons to the page, one that calls `router.history.back({ ignoreBlocker: true })` and another that calls `router.history.go(-1, { ignoreBlocker: true })`.
3. Navigate to the `/two` route in your application.
4. Click the "Back" button. The blocker is skipped as expected (no confirmation dialog).
5. Navigate again to `/two`.
6. Click the "Go(-1)" button. The blocker is **not** skipped and the confirmation dialog appears, even though `ignoreBlocker: true` was passed.

### Expected Behavior

The `ignoreBlocker` option should work consistently across `back`, `forward`, and `go`. When `ignoreBlocker: true` is passed to `history.go`, blockers should be skipped, just like with `back` and `forward`.

### Suggested Fix

Update the `go` method in the TanStack Router's `BrowserHistory` implementation to handle the `ignoreBlocker` option by setting the `skipBlockerNextPop` flag, similar to how it is handled in `back` and `forward`.

### Reference

See [TanStack Router source code](https://github.com/TanStack/router/blob/91e404b1e248a93889f8d731cf374a312d00af59/packages/history/src/index.ts#L503)

---

## `history.go`에서 `ignoreBlocker` 옵션이 동작하지 않는 문제

### 요약

TanStack Router에서 `BrowserHistory`를 사용할 때, `history.back`과 `history.forward`에서는 `ignoreBlocker` 옵션이 정상적으로 동작하지만, **`history.go`에서는 동작하지 않습니다**. 즉, `history.go`에 `ignoreBlocker: true`를 전달해도 네비게이션 blocker가 여전히 실행됩니다.

### 상세 내용

- 소스코드를 보면, `back`과 `forward` 메서드는 `ignoreBlocker` 옵션이 있을 때 `skipBlockerNextPop` 플래그를 `true`로 설정하여 blocker를 우회합니다.
- 하지만 `go` 메서드에서는 이 플래그를 설정하지 않아, `ignoreBlocker` 옵션과 상관없이 항상 blocker가 실행됩니다.
- 이로 인해 여러 단계 뒤로 이동할 때 blocker를 프로그래밍적으로 우회할 수 없습니다.

### 기대 동작

`ignoreBlocker` 옵션이 `back`, `forward`, `go` 모두에서 일관되게 동작해야 합니다. 즉, `history.go`에 `ignoreBlocker: true`를 전달하면 blocker가 실행되지 않아야 합니다.

### 재현 방법

1. `useBlocker`를 사용하는 라우트(`/two` 등)를 만듭니다:

   ```tsx
   function Two() {
     useBlocker({
       shouldBlockFn: () => {
         return !confirm("Are you sure you want to leave?");
       },
     });

     const router = useRouter();

     const handleBack = () => {
       router.history.back({
         ignoreBlocker: true,
       });
     };

     const handleGo = () => {
       router.history.go(-1, {
         ignoreBlocker: true,
       });
     };

     return (
       <div>
         <h1>Hello "/two"!</h1>
         <button onClick={handleBack}>Back</button>
         <button onClick={handleGo}>Go(-1)</button>
       </div>
     );
   }
   ```

2. 각각 `router.history.back({ ignoreBlocker: true })`와 `router.history.go(-1, { ignoreBlocker: true })`를 호출하는 버튼을 추가합니다.
3. 앱에서 `/two`로 이동합니다.
4. "Back" 버튼을 클릭하면 blocker가 무시되어(확인창 없음) 정상 동작합니다.
5. 다시 `/two`로 이동합니다.
6. "Go(-1)" 버튼을 클릭하면 blocker가 무시되지 않고 확인창이 뜹니다.

### 제안하는 수정

TanStack Router의 `BrowserHistory` 구현에서 `go` 메서드도 `back`/`forward`처럼 `ignoreBlocker` 옵션이 있으면 `skipBlockerNextPop` 플래그를 설정하도록 수정해야 합니다.

### 참고

자세한 내용은 [TanStack Router 소스코드](https://github.com/TanStack/router/blob/91e404b1e248a93889f8d731cf374a312d00af59/packages/history/src/index.ts#L503)를 참고하세요.
