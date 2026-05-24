import React, { useMemo } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import './JsonTreeView.css';

export interface JsonTreeViewProps {
  jsonString: string;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ jsonString }) => {
  const treeData = useMemo(() => {
    if (!jsonString || jsonString.trim() === '') return [];
    
    try {
      const parsed = JSON.parse(jsonString);
      
      const buildTree = (data: any, keyPath: string, name: string): TreeDataNode => {
        // null
        if (data === null) {
          return {
            title: (
              <span className="tree-node">
                <span className="node-key">{name}: </span>
                <span className="node-value node-null">null</span>
              </span>
            ),
            key: keyPath,
            isLeaf: true,
          };
        }
        
        // Array
        if (Array.isArray(data)) {
          const children = data.map((item, index) => 
            buildTree(item, `${keyPath}-${index}`, String(index))
          );
          return {
            title: (
              <span className="tree-node">
                <span className="node-key">{name} </span>
                <span className="node-info">[{data.length} items]</span>
              </span>
            ),
            key: keyPath,
            children,
          };
        }
        
        // Object
        if (typeof data === 'object') {
          const keys = Object.keys(data);
          const children = keys.map(k => 
            buildTree(data[k], `${keyPath}-${k}`, k)
          );
          return {
            title: (
              <span className="tree-node">
                <span className="node-key">{name} </span>
                <span className="node-info">{'{'}{keys.length} keys{'}'}</span>
              </span>
            ),
            key: keyPath,
            children,
          };
        }
        
        // Primitives (string, number, boolean)
        const isString = typeof data === 'string';
        const displayValue = isString ? `"${data}"` : String(data);
        const valueClass = `node-value node-${typeof data}`;
        
        return {
          title: (
            <span className="tree-node">
              <span className="node-key">{name}: </span>
              <span className={valueClass}>{displayValue}</span>
            </span>
          ),
          key: keyPath,
          isLeaf: true,
        };
      };

      // 根节点
      let rootName = 'Root';
      if (Array.isArray(parsed)) rootName = 'Array';
      else if (parsed !== null && typeof parsed === 'object') rootName = 'Object';
      
      return [buildTree(parsed, 'root', rootName)];
      
    } catch (e) {
      return [];
    }
  }, [jsonString]);

  if (!treeData.length) {
    return <div className="json-tree-empty">无有效数据</div>;
  }

  return (
    <div className="json-tree-container">
      <Tree
        treeData={treeData}
        defaultExpandAll={false}
        defaultExpandedKeys={['root']}
        showLine={{ showLeafIcon: false }}
        selectable={false}
        blockNode
      />
    </div>
  );
};

export default JsonTreeView;