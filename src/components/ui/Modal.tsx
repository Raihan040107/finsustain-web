interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Modal({ isOpen, onClose, title, description, buttonText = "OK", onButtonClick }: ModalProps) {
  const handleClick = () => {
    if (onButtonClick) onButtonClick();
    else onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? "show" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <h3>{title}</h3>
        {description && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>{description}</p>}
        <button className="btn btn-primary" onClick={handleClick}>{buttonText}</button>
      </div>
    </div>
  );
}