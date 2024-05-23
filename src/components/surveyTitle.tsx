interface SurveyTitleProps {
    title: string
}

function SurveyTitle(props: SurveyTitleProps) {
    return <>
        <div className="survey-title">
            <h1>{props.title}</h1>
        </div>
    </>
}

export default SurveyTitle