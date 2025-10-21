<?php

namespace App\Services;

use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\Algorithm\PS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;

class JwsSigner
{
    public function sign(array $payload): string
    {
        $p12Path = config('app.p12_path', env('P12_PATH'));
        $p12Password = env('P12_PASSWORD');

        if (! is_file($p12Path)) {
            throw new \RuntimeException(sprintf('Certificate not found at %s', $p12Path));
        }

        $p12Contents = file_get_contents($p12Path);
        if (! openssl_pkcs12_read($p12Contents, $certificates, $p12Password)) {
            throw new \RuntimeException('Falha ao ler .p12 (senha/cert).');
        }

        $privateKey = $certificates['pkey'];
        $leafCertificate = $certificates['cert'];
        $chain = $certificates['extracerts'] ?? [];

        $toX5c = static function (string $pem): string {
            $lines = array_filter(array_map('trim', explode("\n", $pem)), static fn ($line) => ! str_starts_with($line, '---'));
            return implode('', $lines);
        };

        $x5c = array_map($toX5c, array_merge([$leafCertificate], $chain));

        $jwk = JWK::createFromKey($privateKey, [
            'use' => 'sig',
            'alg' => 'PS256',
            'kid' => env('JWS_KID', 'KID_ATUAL'),
        ]);

        $algorithmManager = new AlgorithmManager([new PS256()]);
        $builder = new JWSBuilder($algorithmManager);

        $jws = $builder->create()
            ->withPayload(json_encode($payload, JSON_UNESCAPED_SLASHES))
            ->addSignature($jwk, [
                'alg' => 'PS256',
                'kid' => $jwk->get('kid'),
                'x5c' => $x5c,
            ])
            ->build();

        return (new CompactSerializer())->serialize($jws, 0);
    }
}
