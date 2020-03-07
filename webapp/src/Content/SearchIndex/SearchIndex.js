import React from "react";
import "./SearchIndex.css";
import Tabs from './Tabs';
import EpidemicTitleImg from "../../assets/img/index_title.png";
import logoImg from "../../assets/img/logo.png";
import ReactEcharts from "echarts-for-react";
import {tooltipStyle} from "../../Utils/Utils";
import Banner from "../../assets/img/banner.jpg";
import Loading from "../../Loading/Loading";
import Axios from "axios";
import API, {lineChartInterval} from "../../Utils/Config";


class SearchIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indexData: null
        }
    }

    async componentDidMount() {
        if (this.props.indexData) {
            this.setState({indexData: this.props.indexData})
        } else {
            const data = (await Axios.get(API.index)).data;
            this.setState({
                indexData: data
            });
            this.props.collectData("indexData", data);
        }
    }

    render() {
        let dom = <Loading/>;
        if (this.state.indexData) {
            dom =
                <div className="index-container">
                    <div className="header" style={{backgroundImage: `url("${Banner}")`}}>
                        <img className="title" src={EpidemicTitleImg} alt="搜索指数"/>
                        <p className="cooperate">
                            <img src={logoImg} alt=""/>
                            上海市数据科学重点实验室
                        </p>
                    </div>
                    <div className="pneumonia-block-container">
                        <div className="block-title">
                            <p className="title">搜索指数</p>
                            <p className="update-time">数据来源于百度指数</p>
                        </div>
                        <Tabs>
                            <div label="上海搜索指数">
                                <div className="epidemic-trends">
                                    <ReactEcharts option={this.shanghaiIndexOption()} style={{height: "250px"}}/>
                                </div>
                                <div className="epidemic-trends">
                                    <ReactEcharts option={this.shanghaiMultiplyOption()} style={{height: "300px"}}/>
                                    <div className="epidemic-trends-legend">
                                        <span className="confirmed">确诊</span>
                                        <span className="treating">存量</span>
                                        <span className="heal">治愈</span>
                                        <span className="dead">死亡</span>
                                        <span className="index">指数</span>
                                    </div>
                                </div>
                            </div>
                            <div label="全国搜索指数">
                                <div className="epidemic-trends">
                                    <ReactEcharts option={this.nationalIndexOption()} style={{height: "250px"}}/>
                                </div>
                                <div className="epidemic-trends">
                                    <ReactEcharts option={this.nationalMultiplyOption()} style={{height: "250px"}}/>
                                    <div className="epidemic-trends-legend">
                                        <div className="epidemic-trends-legend-container">
                                            <span className="confirmed">确诊</span>
                                            <span className="heal">治愈</span>
                                            <span className="dead">死亡</span>
                                            <span className="index">指数</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
        }
        return dom;
    }

    shanghaiMultiplyOption = () => {
        const series = this.state.indexData.series.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        const xAxis = series.map((item) => {
            return item.date.slice(5).replace("-", ".");
        });
        const confirmedSeries = series.map((item) => {
            return item.confirmedNum;
        });
        const treatingSeries = series.map(item => {
            return item.treatingNum;
        });
        const deathsSeries = series.map((item) => {
            return item.deathsNum;
        });
        const curesSeries = series.map((item) => {
            return item.curesNum;
        });

        const index = this.state.indexData.shanghai_index;

        return {
            title: {
                text: '指数随疫情趋势',
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: tooltipStyle,
            color: ["#ae212c", "#d96322", "#39c4c4", "#0f3046", "#b1398c"],
            grid: {
                top: '14%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    rotate: 40,
                    interval: lineChartInterval,
                    color: "#9e9e9e",
                    fontSize: 9,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            }, {
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            }],
            series: [
                {
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: confirmedSeries
                },
                {
                    name: '存量',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: treatingSeries
                },
                {
                    name: '治愈',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: curesSeries
                },
                {
                    name: '死亡',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: deathsSeries
                },
                {
                    name: '指数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    showAllSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                type: 'dotted'
                            }
                        }
                    },
                    data: index
                }
            ]
        };
    };

    nationalMultiplyOption = () => {
        const series = this.state.indexData.national_series.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        const xAxis = series.map((item) => {
            return item.date.slice(5).replace("-", ".");
        });
        const confirmedSeries = series.map((item) => {
            return item.confirmedNum;
        });
        const deathsSeries = series.map((item) => {
            return item.deathsNum;
        });
        const curesSeries = series.map((item) => {
            return item.curesNum;
        });

        const index = this.state.indexData.national_index;

        return {
            title: {
                text: '指数随疫情趋势',
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: tooltipStyle,
            color: ["#ae212c", "#39c4c4", "#0f3046", "#b1398c"],
            grid: {
                top: '14%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    rotate: 40,
                    interval: lineChartInterval,
                    color: "#9e9e9e",
                    fontSize: 9,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            },
            yAxis: [{
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            }, {
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            }],
            series: [
                {
                    name: '确诊',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: confirmedSeries
                },
                {
                    name: '治愈',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: curesSeries
                },
                {
                    name: '死亡',
                    type: 'line',
                    smooth: true,
                    showAllSymbol: false,
                    data: deathsSeries
                },
                {
                    name: '指数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    showAllSymbol: false,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                                color: '#b1398c',
                                type: 'dotted'  //'dotted'虚线 'solid'实线
                            }
                        }
                    },
                    data: index
                }
            ]
        };
    };

    shanghaiIndexOption = () => {
        const series = this.state.indexData.series.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        const xAxis = series.map((item) => {
            return item.date.slice(5).replace("-", ".");
        });

        xAxis.pop();

        const index = this.state.indexData.shanghai_index;

        return {
            title: {
                text: '新冠病毒搜索指数',
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: tooltipStyle,
            grid: {
                top: '14%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    rotate: 40,
                    interval: lineChartInterval,
                    color: "#9e9e9e",
                    fontSize: 9,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            },
            series: [{
                name: '搜索指数',
                smooth: true,
                type: 'line',
                showAllSymbol: false,
                color: '#b1398c',
                data: index
            }]
        }
    };

    nationalIndexOption = () => {
        const series = this.state.indexData.series.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        const xAxis = series.map((item) => {
            return item.date.slice(5).replace("-", ".");
        });

        xAxis.pop();

        const index = this.state.indexData.national_index;

        return {
            title: {
                text: '新冠病毒搜索指数',
                textStyle: {
                    fontSize: 14
                }
            },
            tooltip: tooltipStyle,
            grid: {
                top: '14%',
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    rotate: 40,
                    interval: lineChartInterval,
                    color: "#9e9e9e",
                    fontSize: 9,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
                data: xAxis
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: "#505050",
                    fontSize: 10,
                    showMaxLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ebebeb"
                    }
                },
                axisTick: {
                    show: false
                },
            },
            series: [{
                name: '搜索指数',
                smooth: true,
                type: 'line',
                showAllSymbol: false,
                data: index,
                color: '#b1398c'
            }]
        }
    };
}

export default SearchIndex;