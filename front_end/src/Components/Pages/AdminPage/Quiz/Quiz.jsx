import React, {Component, Fragment} from 'react';
import { Helmet } from 'react-helmet';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import LightbulbIcon from '@mui/icons-material/Lightbulb'; ลองใช้2ตัวนี้แล้วแดง
import "./Quiz.css";

class Quize extends Component {


    increaseCount = () => {
        this.setState({
            counter: 5
        });
    };

    render() {
        return (
            <Fragment>
                <Helmet><title>Quize Page</title></Helmet>
                <div className='questions'>
                    <div className='lifeline-container'>
                        <p>
                            <span className='mid mid-set-center mid-24px lifeline-icon'></span>2
                        </p>
                        <p>
                            2:15<span className='mid mid-lightbuib-on-outline mid-24px lifeline-icon'></span>2
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>1 of 15</span>
                            <spam className="mid mid-clock-outline mid-24px"></spam>
                        </p>
                    </div>
                    <h5>Google was founded in what year?</h5>
                    <div className='options-container'>
                        <p className='option'>1997</p>
                        <p className='option'>1998</p>
                    </div>
                    <div className='options-container'>
                    <p className='option'>1999</p>
                    <p className='option'>2000</p>
                    </div>

                    <div className='botton-container'>
                        <button>Previous</button>
                        <button>Next</button>
                        <button>Quit</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Quize;