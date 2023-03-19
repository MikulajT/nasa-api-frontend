import "./styles/LoadingEllipsis.css";

function LoadingEllipsis() {
    return (
        <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default LoadingEllipsis;