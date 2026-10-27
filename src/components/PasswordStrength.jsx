const LEVELS = [
  { text: "", color: "#e0e0e0" },
  { text: "Yếu", color: "#eb5757" },
  { text: "Trung bình", color: "#f2994a" },
  { text: "Khá", color: "#e2b93b" },
  { text: "Mạnh", color: "#27ae60" },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score === 0) score = 1;

  const level = LEVELS[score];

  return (
    <div className="password-strength">
      <div className="strength-bar">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            style={{ background: item <= score ? level.color : "#e0e0e0" }}
          ></span>
        ))}
      </div>
      <small style={{ color: level.color }}>Độ mạnh: {level.text}</small>
    </div>
  );
}
