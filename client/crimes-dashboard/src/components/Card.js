const Card = ({ children, style }) => (
    <div
        style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            ...style
        }}
    >
        {children}
    </div>
);

export default Card;