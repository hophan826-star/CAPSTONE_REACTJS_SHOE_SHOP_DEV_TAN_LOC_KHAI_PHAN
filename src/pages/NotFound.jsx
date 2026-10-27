import { Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

export default function NotFound() {
  useTitle('404');
  return (
    <div className="container text-center not-found">
      <h1>404</h1>
      <p>Không tìm thấy trang bạn yêu cầu!</p>
      <Link to="/" className="btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
