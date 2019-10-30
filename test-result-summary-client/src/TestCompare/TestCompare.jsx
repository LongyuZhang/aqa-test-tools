import React, { Component } from 'react';
import { Row, Col, Button, Checkbox } from 'antd';
import TestInfo from './TestInfo'
import $ from 'jquery';

require('codemirror');
require('codemirror/lib/codemirror.css');
require('mergely');
require('mergely/lib/mergely.css');

export default class TestCompare extends Component {
    state = {
        copy: { url: true, buildName: true, buildNum: true, testName: false },
        forms: [{
            url: "https://ci.eclipse.org/openj9", buildName: "Test-Sanity-JDK10-aix_ppc-64_cmprssptrs", buildNum: 36, testName: "jit_jitt_3"
        }, {
            url: "https://ci.eclipse.org/openj9", buildName: "Test-Sanity-JDK10-aix_ppc-64_cmprssptrs", buildNum: 35, testName: "jit_jitt_3"
        }],
        tests: [{}, {}],
        timeStamp: false,
        deepSmith: false
    }

    componentDidMount() {
        $( this.compare ).mergely( {
            cmsettings: { readOnly: true }
        } );
    }

    onChange = ( formId, field, event ) => {
        this.state.forms[formId][field] = event.target.value;
        if ( formId === 0 ) {
            this.state.forms[1][field] = this.state.forms[0][field];
        }
        this.setState( this.state );
    };

    toggleTimeStamp = () => {
        this.setState({ timeStamp: !this.state.timeStamp });
    }

    toggleDeepSmith = () => {
        this.setState({ deepSmith: !this.state.deepSmith });
    }


    handleCompare = async () => {
        $( this.compare ).mergely( 'lhs', '' );
        $( this.compare ).mergely( 'rhs', '' );

        for ( var i = 0; i < this.state.forms.length; i++ ) {
            const { url, buildName, buildNum, testName } = this.state.forms[i];
            const response = await fetch( `/api/getOutputByTestInfo?url=${encodeURIComponent( url )}&buildName=${encodeURIComponent( buildName )}&buildNum=${buildNum}&testName=${testName}`, {
                method: 'get'
            } );
            const res = await response.json();
            if ( res && res.output ) {
                let curOutput = res.output;
                if (this.state.timeStamp === false) {
                    // remove timeStamp
                    curOutput = res.output.replace(/\[\d{4}-\d{2}-\d{2}.*?\] /g, "");
                }
                if (this.state.deepSmith === true) {
                    // remove beginning setup info and end test info
                    let startWords = "Running Java Driver:";
                    let endWords = "deepSmith_0_";
                    curOutput = curOutput.substring(curOutput.indexOf(startWords), curOutput.lastIndexOf(endWords));
                    // remove @XXXX format, e.g. @3b995
                    curOutput = curOutput.replace(/@\w+/g, "@");
                    // remove exception code location, e.g. Thread.java:832 -> Thread.java:
                    curOutput = curOutput.replace(/.java:\d+/g, ".java:");
                    // remove extra outputs for Exception, e.g. NegativeArraySizeException: -1238
                    curOutput = curOutput.replace(/Exception.*/g, "Exception");
                    // match getConstructor0 to newNoSuchMethodException
                    curOutput = curOutput.replace(/getConstructor0.*/g, "newNoSuchMethodException");

                }     
                res.output = curOutput;
                this.state.tests[i] = res;
            } else {
                alert( "Cannot find data! Please check your input values." );
                return;
            }
        }
        this.setState( this.state );

        $( this.compare ).mergely( 'lhs', this.state.tests[0].output );
        $( this.compare ).mergely( 'rhs', this.state.tests[1].output );
    }

    render() {
        return <div>
            <Row gutter={24}>
                <Col span={12}>
                    <TestInfo data={this.state.forms[0]} onChange={this.onChange.bind( null, 0 )} />
                </Col>
                <Col span={12}>
                    <TestInfo data={this.state.forms[1]} onChange={this.onChange.bind( null, 1 )} />
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Checkbox onChange={this.toggleTimeStamp}>TimeStamp</Checkbox>
                    <Checkbox onChange={this.toggleDeepSmith}>DeepSmith_Match</Checkbox>
                    <Button type="primary" onClick={this.handleCompare}>Compare</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>Clear</Button>
                </Col>
            </Row>
            <div ref={compare => this.compare = $( compare )}></div>
        </div>
    }
}