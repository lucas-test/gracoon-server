import { BasicLink, BasicLinkData, BasicVertex, BasicVertexData, Coord } from "gramoloss";
import { emitGraphToRoom } from "../..";
import { handleBoardModification } from "../../handler";
import { HistBoard } from "../../hist_board";
import { Client } from "../../user";
import { BoardModification, SENSIBILITY, ServerBoard } from "../modification";



export class SubdivideLinkModification implements BoardModification {
    newVertex: BasicVertex<BasicVertexData>;
    newLink1: BasicLink<BasicVertexData, BasicLinkData>;
    newLink2: BasicLink<BasicVertexData, BasicLinkData>;
    oldLink: BasicLink<BasicVertexData, BasicLinkData>;
    callback: (response: number) => void;
    
    constructor(newVertex: BasicVertex<BasicVertexData>, newLink1: BasicLink<BasicVertexData, BasicLinkData>, newLink2: BasicLink<BasicVertexData, BasicLinkData>,  oldLink: BasicLink<BasicVertexData, BasicLinkData>, callback: (response: number) => void ) {
        this.newVertex = newVertex;
        this.newLink1 = newLink1;
        this.newLink2 = newLink2;
        this.oldLink = oldLink;
        this.callback = callback;
    }

    try_implement(board: ServerBoard): Set<SENSIBILITY> | string{
        board.graph.vertices.set(this.newVertex.index, this.newVertex);
        board.graph.links.delete(this.oldLink.index);
        board.graph.links.set(this.newLink1.index, this.newLink1);
        board.graph.links.set(this.newLink2.index, this.newLink2);
        return new Set();
    }

    deimplement(board: ServerBoard): Set<SENSIBILITY>{
        board.graph.vertices.delete(this.newVertex.index);
        board.graph.links.delete(this.newLink1.index);
        board.graph.links.delete(this.newLink2.index);
        board.graph.links.set(this.oldLink.index, this.oldLink);
        return new Set();
    }

    static fromGraph(board: ServerBoard, oldLinkIndex: number, pos: Coord, weight: string, color: string, callback: (response: number) => void  ): SubdivideLinkModification | undefined{
        const oldLink = board.graph.links.get(oldLinkIndex);
        if (typeof oldLink == "undefined"){
            console.log (`Error: cannot create SubdivideLink from graph. ${oldLinkIndex} is not a valid link index.`)
            return undefined;
        }

        const newVertexData = new BasicVertexData( pos, weight, color);
        const newVertexIndex = board.graph.get_next_available_index_vertex();
        const newVertex = new BasicVertex(newVertexIndex, newVertexData);

        const newLink1Data = new BasicLinkData( undefined, "", oldLink.data.color);
        const newLink2Data = new BasicLinkData( undefined, "", oldLink.data.color);
        const [newLink1Index, newLink2Index] = board.graph.get_next_n_available_link_indices(2);

        const newLink1 = new BasicLink(newLink1Index, oldLink.startVertex, newVertex, oldLink.orientation, newLink1Data);
        const newLink2 = new BasicLink(newLink2Index, newVertex, oldLink.endVertex, oldLink.orientation, newLink2Data);
        
        return new SubdivideLinkModification(newVertex, newLink1, newLink2,  oldLink, callback )
    }

    static handle(board: HistBoard, clientId: string, linkIndex: number, pos: Coord, weight: string, color: string, callback: (response: number) => void){
        console.log(`Handle: subdivide_link b:${board.roomId} u:${clientId}`, linkIndex);
        const modif = SubdivideLinkModification.fromGraph(board, linkIndex, pos, weight, color, callback);
        handleBoardModification(board, modif);
    }

    firstEmitImplementation(board: HistBoard){
        this.callback(this.newVertex.index);
    }

    emitImplementation(board: HistBoard){
        emitGraphToRoom(board, new Set());
    }

    emitDeimplementation(board: HistBoard): void {
        emitGraphToRoom(board, new Set());
    }

    static addEvent(client: Client){
        client.socket.on("subdivide_link", (linkIndex: number, pos: {x: number, y: number}, weight: string, color: string, callback: (response: number) => void) => {SubdivideLinkModification.handle(client.board, client.label, linkIndex, new Coord(pos.x, pos.y), weight, color, callback)} );
    }

}