import React from 'react';
import { Badge, Button, CardHeader, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';

export default function MediaLiveCardHeader(props) {
    const { node, isRefreshing = false } = props;
    const policy = usePolicy();
    const nodeStatus = node.get('status').getValue();
    const canUpdateVideo = policy.isGranted(`${APP_VENDOR}:video:update`);

    return (
        <CardHeader>
            <div className="w-100">
                {node.get('title')}{isRefreshing && <Spinner />}
                {node.isInMap('tags', 'livestream_label') && (
                    <Badge color="light" className="ms-2">{node.getFromMap('tags', 'livestream_label')}</Badge>
                )}
                <Badge className={`status-${nodeStatus} ms-2`}>
                    {nodeStatus}
                </Badge>
            </div>
            <div className="ms-auto text-nowrap">
                <Link to={nodeUrl(node, 'view')}>
                    <Button color="hover" tag="span">
                        <Icon imgSrc="eye" alt="view" />
                    </Button>
                </Link>
                {canUpdateVideo && (
                    <Link to={nodeUrl(node, 'edit')}>
                        <Button color="hover" tag="span">
                            <Icon imgSrc="pencil" alt="edit" />
                        </Button>
                    </Link>
                )}
                <a href={nodeUrl(node, 'canonical')} target="_blank" rel="noopener noreferrer">
                    <Button color="hover" tag="span">
                        <Icon imgSrc="external" alt="open" />
                    </Button>
                </a>
            </div>
        </CardHeader>
    );
}
