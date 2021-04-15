import '../../App.css';
import { Button } from '../Button';

function Home () {
    return (
        <>
            <h1>Welcome to AskMeAnything</h1>
            <div className='block-container'>
                <ul>
                    <Button buttonStyle='btn--block' buttonSize='btn--large' path='/'>
                        Questions per keyword
                    </Button>
                    <Button buttonStyle='btn--block' buttonSize='btn--large' path='/'>
                        Questions per period
                    </Button>
                    <Button buttonStyle='btn--block' buttonSize='btn--large' path='/'>
                        Ask a new question
                    </Button>
                    <Button buttonStyle='btn--block' buttonSize='btn--large' path='/'>
                        Answer a question
                    </Button>
                </ul>
            </div>
        </>
    )
}

export default Home;