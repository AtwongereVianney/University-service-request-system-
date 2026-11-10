<?php

function quoteDatabaseIdentifier($identifier)
{
    if (!preg_match('/^[A-Za-z0-9_]{1,64}$/', $identifier)) {
        throw new InvalidArgumentException('Database names may only contain letters, numbers and underscores.');
    }

    return '`' . $identifier . '`';
}
