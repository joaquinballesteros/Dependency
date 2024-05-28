import { Spinner } from "react-bootstrap"

interface LoadingScreenProps {
    title?: string
}

function LoadingScreen(props: LoadingScreenProps) {
    return <div className="loading-div">
        <h2 className="mb-2">{props.title ?? "Cargando..."}</h2>
        <Spinner></Spinner>
    </div>
}

export default LoadingScreen