const Button = ({
  size = 'md',
  color,
  icon,
  onClick,
  title,
  type,
  children,
  disabled,
  role,
}) => {
  return (
    <button
      className={`btn btn--${size} btn--${color} ${icon ? `btn--icon btn--${icon}` : ''}`}
      onClick={onClick}
      title={title}
      type={type || 'button'}
      disabled={disabled}
      role={role || 'button'}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
