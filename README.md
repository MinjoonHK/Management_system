# Management_system
2023.08 여름 인턴십 내부용 매니지먼트 시스템

## 💻 프로젝트 소개
여름 인턴십 기간 동안 수행한 내부용 매니지먼트 시스템의 개인 기록용 리포지토리 입니다.

## ⏲️ 개발 기간
2023.06 - 2023.08

### ⚙️ 개발 환경
<ul>
  <li>React.js, Node.js, TypeScript, Express.js</li>
  <li>node.js 18.11.0</li>
  <li>IDE : VScode, MySQL Workbench</li>
  <li>Database : MySQL</li>
</ul>

### ✔️ERD
<details>
<summary>이미지</summary>

![ERD](https://github.com/MinjoonHK/Management_system/assets/108560916/951ecf1d-37ce-489d-9fe7-cba417f3f132)
</details>

## 📌주요 기능
### -로그인
#### 💻Code

<details>
<summary>checkIsLoggedIn.ts - 유저가 로그인했는지 체크해주는 미들웨어</summary>

```
export function validationIsLogggedIn(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        config.get("jwt.passphase")!
      ) as DecodedToken;
      req.userId = decoded.ID;
      return next();
    } catch (err) {
      console.error(err);
    }
  }
  return next("UNAUTHORIZED ACTION");
}
```
</details>
<details>
<summary>이미지</summary>


</details>
<details>
<summary>이미지</summary>


</details>

### -회원가입
#### 💻Code


### -유저관리
#### 💻Code

### -파일교환
#### 💻Code

### -갠트차트
#### 💻Code

### -달력
#### 💻Code

### -언어지원
#### 💻Code





