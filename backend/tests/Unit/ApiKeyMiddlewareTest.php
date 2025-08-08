<?php

namespace Tests\Unit;

use App\Http\Middleware\ApiKeyMiddleware;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ApiKeyMiddlewareTest extends TestCase
{
    private ApiKeyMiddleware $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new ApiKeyMiddleware();
    }

    public function test_allows_request_with_valid_api_key(): void
    {
        $request = Request::create('/api/test', 'GET');
        $request->headers->set('X-API-Key', 'joonik-secret-api-key-2024');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('Success', $response->getContent());
    }

    public function test_rejects_request_with_invalid_api_key(): void
    {
        $request = Request::create('/api/test', 'GET');
        $request->headers->set('X-API-Key', 'invalid-key');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Invalid or missing API key', $responseData['message']);
    }

    public function test_rejects_request_without_api_key(): void
    {
        $request = Request::create('/api/test', 'GET');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Invalid or missing API key', $responseData['message']);
    }

    public function test_rejects_request_with_empty_api_key(): void
    {
        $request = Request::create('/api/test', 'GET');
        $request->headers->set('X-API-Key', '');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Invalid or missing API key', $responseData['message']);
    }

    public function test_case_sensitive_api_key(): void
    {
        $request = Request::create('/api/test', 'GET');
        $request->headers->set('X-API-Key', 'JOONIK-SECRET-API-KEY-2024');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
    }

    public function test_different_header_name_fails(): void
    {
        $request = Request::create('/api/test', 'GET');
        $request->headers->set('Authorization', 'joonik-secret-api-key-2024');

        $response = $this->middleware->handle($request, function ($req) {
            return new Response('Success', 200);
        });

        $this->assertEquals(401, $response->getStatusCode());
    }
}