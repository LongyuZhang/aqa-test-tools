import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
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
        tests: [{}, {}]
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
                // curOutput = res.output.replace(/\[.*?\] /g, "");  https://hyc-runtimes-jenkins.swg-devops.com
                // let curOutput = res.output.replace(/^\[\d{4}-\d{2}-\d{2}.*?\] /g, "");
                // remove timeStamp
                let curOutput = res.output.replace(/\[\d{4}-\d{2}-\d{2}.*?\] /g, "");
                // remove beginning setup info and end test info
                let startWords = "Running Java Driver:";
                let endWords = "deepSmith_0_";
                curOutput = curOutput.substring(curOutput.indexOf(startWords), curOutput.lastIndexOf(endWords));
                
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
                    <Button type="primary" onClick={this.handleCompare}>Compare</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>Clear</Button>
                </Col>
            </Row>
            <div ref={compare => this.compare = $( compare )}></div>
        </div>
    }
}