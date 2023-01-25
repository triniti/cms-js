import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';
import variants from './variants';
import './variants.scss';

const getVariantSrc = (asset, version) => {
    const rand = `?r=${(new Date()).getTime()}`;
    return `${damUrl(asset, version, 'sm')}${rand}`;
};

export default function VariantsTab({ type, asset }) {
    const variantScope = variants[type];
    return (
        <Card>
            <CardHeader>Variants</CardHeader>
            <CardBody className="pl-0 pe-0 pt-0 variants-body">
                <p>
                    Click an image you would like to replace or drag a new image over it.
                </p>
                <div>
                    {Object.keys(variantScope).map((version) => {
                        const label = variantScope[version];
                        return (
                            <div key={version} className="thumbnail">
                                <p>{label}</p>
                                <img src={getVariantSrc(asset, version)} alt={label} />
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}