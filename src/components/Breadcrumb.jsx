import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      <Link to="/">🏠 首页</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span className="separator">›</span>
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
