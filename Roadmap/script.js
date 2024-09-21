let treeData = {
    name: "",
    children: [
        {
            name: "Frontend",
            children: [
                { name: "Next.js" },
                { name: "Three.js" },
                { name: "d3.js" }
            ]
        },
        {
            name: "Backend",
            children: [
                { name: "Node.js" },
                { name: "Express.js" },
                { name: "Django" }
            ]
        }
    ]
};

const width = 600;
const height = 400;
let svg, root, treeLayout;
let i = 0;

function initializeTree() {
    const rootName = document.getElementById('root-name').value;
    if (!rootName) {
        alert("Please enter a root node name.");
        return;
    }
    
    treeData.name = rootName;
    
    // Clear previous tree if any
    d3.select("#tree").selectAll("*").remove();

    // Create the SVG container for the tree diagram
    svg = d3.select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");

    // Define the tree layout
    treeLayout = d3.tree().size([height, width - 160]);

    // Convert the data to a hierarchy
    root = d3.hierarchy(treeData);

    // Collapse all nodes initially except the root
    root.descendants().forEach(d => {
        if (d.depth > 0) d._children = d.children;
        if (d.depth > 0) d.children = null;
    });

    // Initial update
    update(root);
}

function update(source) {
    // Apply the tree layout to the hierarchy data
    const treeData = treeLayout(root);

    // Update the links first so they are rendered below the nodes
    const links = svg.selectAll(".link")
        .data(treeData.links(), d => d.target.id);

    const linkEnter = links.enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => source.y0)
            .y(d => source.x0));

    const linkUpdate = linkEnter.merge(links);

    linkUpdate.transition()
        .duration(500)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    links.exit().transition()
        .duration(500)
        .attr("d", d3.linkHorizontal()
            .x(d => source.y)
            .y(d => source.x))
        .remove();

    // Update the nodes after links
    const nodes = svg.selectAll(".node")
        .data(treeData.descendants(), d => d.id || (d.id = ++i));

    const nodeEnter = nodes.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.y0}, ${source.x0})`)
        .on("click", toggleNode);

    nodeEnter.append("circle")
        .attr("r", 30)
        .attr("fill", d => d._children ? "#f9f9f9" : "#fff")
        .attr("stroke", d => d._children ? "red" : "steelblue");

    // Append text after circles to ensure text is on top
    nodeEnter.append("text")
        .attr("dy", 3)
        .attr("text-anchor", "middle")
        .style("font-size", d => {
            const circleRadius = 30;
            const maxFontSize = 12;
            const minFontSize = 6;
            const textLength = d.data.name.length;
            return Math.max(minFontSize, Math.min(maxFontSize, circleRadius / (textLength * 0.5)));
        })
        .text(d => d.data.name)
        .each(function(d) {
            const textElement = d3.select(this);
            const textWidth = textElement.node().getComputedTextLength();
            if (textWidth > 50) {
                textElement.text(d => d.data.name.substring(0, 5) + '...');
            }
        });

    const nodeUpdate = nodeEnter.merge(nodes);

    nodeUpdate.transition()
        .duration(500)
        .attr("transform", d => `translate(${d.y}, ${d.x})`);

    nodes.exit().transition()
        .duration(500)
        .attr("transform", d => `translate(${source.y}, ${source.x})`)
        .remove();

    // Store the old positions for transition.
    nodes.each(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}


function toggleNode(event, d) {
    if (d.children) {
        // If the clicked node is already open, just close it
        d._children = d.children;
        d.children = null;
    } else {
        // If the clicked node is closed, open it and close its siblings
        if (d.parent) {
            d.parent.children.forEach(sibling => {
                if (sibling !== d) {
                    // Close the sibling and all its descendants
                    closeBranch(sibling);
                }
            });
            // Open only the clicked node
            d.children = d._children;
            d._children = null;
        } else {
            // If it's the root node, just toggle it
            d.children = d._children;
            d._children = null;
        }
    }
    update(d);
}

function closeBranch(node) {
    if (node.children) {
        node._children = node.children;
        node.children = null;
        node._children.forEach(closeBranch);
    }
}