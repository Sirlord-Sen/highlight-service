import { expect } from 'chai'
import { random, date, datatype } from 'faker'
import * as sinon  from 'sinon'
import { Highlight } from '../../../main/entity/highlight.entity'
import { HighlightRepository } from "../../../main/repository/highlight.repository"

describe("UserRepository", function() {
    const stubValue = {
      id: datatype.uuid(),
      highlight: random.words(),
      public: datatype.boolean(),
      views: datatype.number(),
      created_at: date.past(),
      updated_at: date.past(),
    //   topic_id: datatype.uuid()
    };
    describe("create", function() {
      it("should add a new highlight to the db", async function() {
        const stub: any = sinon.stub(Highlight, "prototype").returns(stubValue);
        const highlightRepository = new HighlightRepository();
        const highlight = (await highlightRepository.createHighlight([stubValue.highlight]))[0];
        expect(stub.calledOnce).to.be.true;
        expect(highlight.id).to.equal(stubValue.id);
        expect(highlight.highlight).to.equal(stubValue.highlight);
        expect(highlight.recalled).to.equal(0);
        expect(highlight.public).to.equal(stubValue.public)
        expect(highlight.created_at).to.equal(stubValue.created_at);
        expect(highlight.updated_at).to.equal(stubValue.updated_at);
      });
    });
  });