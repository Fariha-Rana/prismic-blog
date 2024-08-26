import * as prismic from "@prismicio/client";

import { Bounded } from "@/components/layout/Bounded";
import { PrismicRichText } from "@/components/layout/PrismicRichText";

const Text = ({ slice }) => {
  return (
    <Bounded as="section">
      {prismic.isFilled.richText(slice.primary.text) && (
        <div className="font-serif leading-relaxed md:text-xl md:leading-relaxed">
          <PrismicRichText field={slice.primary.text} />
        </div>
      )}
    </Bounded>
  );
};

export default Text;
