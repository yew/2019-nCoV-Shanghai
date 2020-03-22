import React from 'react';
import './Tab.css';


class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabList: ["上海疫情", "搜索指数", "疫情问答", "确诊小区", "最新进展", "个人防护", "加入我们"],
            active: 0
        }
    }

    render() {
        return (
            <div className="tab">
                <div className="tab-wrapper">
                    {
                        this.state.tabList.map((item, index) => {
                            let classNameStr = "tab-item";
                            if (index === this.props.active) {
                                classNameStr += " active";
                            }
                            return (
                                <div className={classNameStr} key={index} onClick={() => {
                                    this.clickTab(index)
                                }}>{item}</div>
                            )
                        })
                    }
                    <div className="tab-line" style={{
                        width: `${100 / this.state.tabList.length}%`,
                        transform: `translate3d(${this.state.active * 100}%, 0px, 0px)`
                    }}>
                        <div className="tab-line-center"/>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            active: this.props.active
        })
    }

    clickTab = (index) => {
        document.getElementById("content").scrollTop = 0;
        if (index !== this.state.active) {
            this.setState({
                active: index
            });
            this.props.changeTab(index);
        }
    }
}

export default Tab;
