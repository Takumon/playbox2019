import React from 'react';
import './App.css';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import CytoscapeComponent from 'react-cytoscapejs';

cytoscape.use( cola );

function App() {
  const elements = CytoscapeComponent.normalizeElements({
    nodes: [
      {
        data: {
          id: "1",
          label: "1-lableほげほげほｇへおげｈごえｈげおごえｇへおｇへおげごえごえlableほげほげほｇへおげｈごえｈげおごえｇへおｇへおげごえごえlableほげほげほｇへおげｈごえｈげおごえｇへおｇへおげごえごえlableほげほげほｇへおげｈごえｈげおごえｇへおｇへおげごえごえlableほげほげほｇへおげｈごえｈげおごえｇへおｇへおげごえごえ",
          title: "1-title",
          href: 'http://cytoscape.org' ,
        },
        classes: 'top-center',
      },
      {
        data: {
          id: "2",
          label: "2-lable",
          title: "2-title",
          href: 'http://cytoscape.org' ,
        },
        classes: 'center-left',
      },
      {
        data: {
          id: "3",
          label: "3-lable",
          title: "3-title",
          href: 'http://cytoscape.org' ,
        }
      },
      {
        data: {
          id: "4",
          label: "4-label",
          title: "4-title",
          href: 'http://cytoscape.org' ,
        }
      },
    ],
    edges: [
      {
        data: {
          source: "1",
          target: "2",
          label: '1-2-1-label',
          width: '5px',
        }
      },
      {
        data: {
          source: "1",
          target: "2",
          label: '1-2-2-label',
          width: '5px',
        }
      },
      {
        data: {
          source: "1",
          target: "2",
          label: '1-2-3-label',
          width: '1px',
        }
      },
      {
        data: {
          source: "1",
          target: "3",
          width: '1px',
        }
      },
      {
        data: {
          source: "2",
          target: "3",
          width: '1px',
        }
      },
      {
        data: {
          source: "2",
          target: "4",
          width: '1px',
        }
      },
    ]
  })
  const layout = { name: 'cola' };


  const stylesheet = [
    {
      selector: 'node', 
      style: {
        'shape': 'rectangle',
        // 'content': 'data(label)',
        'label': 'data(label)',
        'text-valign': 'top',
        'padding': '0px',
        'text-margin-y': '0',
        'min-width': '100px',
        'text-background-color': '#f1f1f1',
        'text-background-opacity': 1,
        'text-background-shape': 'rectangle',
        'text-background-padding': '3px',
        'text-max-width': '100px',
        'text-halign': 'center',
        'text-wrap': 'ellipsis',
        'font-size': '8px',
        'border-width': '0.2px',
        'border-style': 'solid',
        'border-color': 'gray',
        'width': '100px',
        'background-width': '100px',
        'height': '50px',
        'background-height': '50px',
        'color': 'gray',
        'background-image': 'https://farm8.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg',
        'background-fit': 'contain',
      },
    },
    {
      selector: 'edge', 
      style: {
        'curve-style': 'bezier',
        'edge-distances': 'control-point-weight',
        'label': 'data(label)',
        'width': 'data(width)',
        'line-color': 'green',
        'line-cap': 'round',
        'text-background-color': '#f1f1f1',
        'text-background-opacity': 1,
        'text-background-shape': 'rectangle',
        'text-background-padding': '3px',
        'text-max-width': '100px',
        'text-halign': 'center',
        'text-wrap': 'ellipsis',
        'font-size': '8px',
      },
    },

    // //セレクターで拾いた内容要素が 指定したCSSを適用する
    // //ノードの中で、label属性は「Peson」のノードが青色で表示し、文字はname属性を表示する
    // {
    //   selector: 'node[label = "Person"]', 
    //   style: {
    //     'background-color': '#6FB1FC',
    //     'content': 'data(name)'
    //   }
    // },
    // //ノードの中で、label属性は「Movie」のノードがオレンジ色で表示し、文字はtitle属性を表示する
    // {
    //   selector: 'node[label = "Movie"]', 
    //   style: {
    //     'background-color': '#F5A45D',
    //     'content': 'data(title)'
    //   }
    // },
    // //エッジ全体で、文字はrelationship属性を表示する、終了点での矢印は三角形にする
    // {
    //   selector: 'edge', 
    //   style: {
    //     'content': 'data(relationship)',
    //     'target-arrow-shape': 'triangle',
    //     'width': '10px',
    //   }
    // } 
  ]

  return (
      <CytoscapeComponent
        elements={elements}
        layout={layout}
        style={{
          width: '100%',
          height: '1000px',
          position: 'relative',
          top: 0,
          left: 0,
          margin: 0,
        }}
        stylesheet={stylesheet}
        cy={cy => {
          cy.on('tap', 'node', function(){
            try {
              window.open( this.data('href') );
            } catch(e) {
              window.location.href = this.data('href');
            }
          });
        }}
      />
  );
}

export default App;
